import Foundation

public class TokenStore {
    private let deviceDetailsProvider = DefaultDeviceDetailsProvider()

    private var keyStore: TokenKeyStore
    private var tokenEncoder: TokenEncoder
    private var deviceAttestator: DeviceAttestator?

    public init(tokenKeyStore keyStore: TokenKeyStore, tokenEncoder: TokenEncoder) {
        self.keyStore = keyStore
        self.tokenEncoder = tokenEncoder
    }

    public func getToken(tokenContext context: TokenContext) -> Token? {
        var token = context.token
        if token == nil || !(token?.isLatestStrain ?? false) {
            token = loadToken(tokenContext: context)
            context.token = token
        }

        if let activeToken = token as? ActivatedToken {
            token = activeToken.fordward()
        }

        return token
    }

    public func setDeviceAttestator(_ deviceAttestator: DeviceAttestator) {
        self.deviceAttestator = deviceAttestator
    }

    public func clearToken(tokenContext context: TokenContext) {
        _ = context.incrementStrainNumber()
        keyStore.removeTokens(tokenContext: context)

        let store = TokenPropertyStore(tokenContext: context)
        store.removeToken()
        store.removePendingNewToken()
        store.removePendingRenewalToken()

        context.token = nil
    }

    public func saveToken(token: ActivatedToken) -> TokenStoreError? {
        var keepTokenIds = [token.tokenId]
        let renewToken = token.renewToken

        if let renewToken = renewToken {
            if renewToken is ActivatedToken {
                return .errorInvalidArgumentException
            }

            keepTokenIds.append(renewToken.tokenId)
        }

        // Remove all existing tokens keys from preferences, and delete keys for tokens not in `keepTokenIds`
        removeAllExistingTokens(tokenContext: token.tokenContext, tokenIdsToKeep: keepTokenIds)

        let store = TokenPropertyStore(tokenContext: token.tokenContext)
        store.setToken(token.tokenId, attestationEncryptionPublicKey: token.attestationEncryptionPublicKey, validityStart: token.validityStart, validityEnd: token.validityEnd)

        guard let pending = renewToken as? PendingToken else {
            return nil
        }

        store.setPendingRenewalToken(pending.tokenId, trace: pending.commandTrace, attestationEncryptionPublicKey: pending.attestationEncryptionPublicKey, attestationObject: pending.attestationObject)

        return nil
    }

    public func savePendingNewToken(token: PendingToken) {
        let store = TokenPropertyStore(tokenContext: token.tokenContext)
        removeAllExistingTokens(tokenContext: token.tokenContext, tokenId: token.tokenId)
        store.setPendingNewToken(token.tokenId, trace: token.commandTrace, attestationEncryptionPublicKey: token.attestationEncryptionPublicKey, attestationObject: token.attestationObject)
    }

    public func convertPendingTokenToActiveToken(token: PendingToken, certificate: Data, validityStart: Date, validityEnd: Date) -> ActivatedToken? {
        let tokenContext = token.tokenContext

        guard let certificate = keyStore.setSignatureCertificate(tokenContext: tokenContext, tokenId: token.tokenId, certificate: certificate) else {
            return nil
        }

        removeAllExistingTokens(tokenContext: tokenContext, tokenId: token.tokenId)
        let store = TokenPropertyStore(tokenContext: tokenContext)
        store.setToken(token.tokenId, attestationEncryptionPublicKey: Data(), validityStart: validityStart, validityEnd: validityEnd)

        let encryptCertificate = keyStore.getEncryptionCertificate(tokenContext: tokenContext, tokenId: token.tokenId)

        let activatedToken = ActivatedToken(tokenId: token.tokenId, signatureKeyId: token.signatureKeyId, signatureKeyPair: token.signatureKeyPair, encryptionKeyPair: token.encryptionKeyPair, attestationEncryptionPublicKey: Data(), validityStart: validityStart, validityEnd: validityEnd, signatureCertificate: certificate, encryptionCertificate: encryptCertificate, tokenEncoder: tokenEncoder, strainNumber: token.strainNumber, tokenContext: token.tokenContext)

        tokenContext.token = activatedToken

        return activatedToken
    }

    public func convertPendingTokenToActiveToken(activatedToken: ActivatedToken, token: PendingToken, certificate: Data, validityStart: Date, validityEnd: Date) -> ActivatedToken? {
        guard let renewedActivatedToken = convertPendingTokenToActiveToken(token: token, certificate: certificate, validityStart: validityStart, validityEnd: validityEnd) else {
            return nil
        }

        activatedToken.renewToken = renewedActivatedToken

        return renewedActivatedToken
    }

    public func convertPendingTokenToActiveTokenWhichMustBeRenewed(activatedToken: ActivatedToken, pendingToken: PendingToken) -> ActivatedToken? {
        guard let renewActivatedToken = convertPendingTokenToActiveTokenWithZeroValidity(pendingToken: pendingToken) else {
            return nil
        }

        activatedToken.renewToken = renewActivatedToken
        activatedToken.markMustBeRenewed()

        return renewActivatedToken
    }

    private func convertPendingTokenToActiveTokenWithZeroValidity(pendingToken: PendingToken) -> ActivatedToken? {
        let tokenContext = pendingToken.tokenContext
        removeAllExistingTokens(tokenContext: tokenContext, tokenId: pendingToken.tokenId)

        let now = Date()

        let store = TokenPropertyStore(tokenContext: tokenContext)
        store.setToken(pendingToken.tokenId, attestationEncryptionPublicKey: Data(), validityStart: now, validityEnd: now)

        let activatedToken = ActivatedToken(tokenId: pendingToken.tokenId, signatureKeyId: pendingToken.signatureKeyId, signatureKeyPair: pendingToken.signatureKeyPair, encryptionKeyPair: pendingToken.encryptionKeyPair, attestationEncryptionPublicKey: Data(), validityStart: now, validityEnd: now, signatureCertificate: nil, encryptionCertificate: nil, tokenEncoder: tokenEncoder, strainNumber: pendingToken.strainNumber, tokenContext: tokenContext)

        tokenContext.token = activatedToken

        return activatedToken
    }

    public func createPendingToken(activatedToken: ActivatedToken, tokenId: String, nonce: Data, traceId: String, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<PendingToken, TokenStoreError>) -> Void) {
        debugPrint("Generated signature + encryption key pair for token \(tokenId) renewal")

        let context = activatedToken.tokenContext

        guard case let .success(encryptionKeyPair) = keyStore.createEncryptionKey(tokenContext: context, tokenId: tokenId) else {
            return callback(.failure(.errorCreatingEncryptionKey))
        }

        if #available(iOS 14.0, *) {
            keyStore.createSignatureKey(tokenContext: context, tokenId: tokenId) { signatureKeyIdResult in
                guard case let .success(newSignatureKeyId) = signatureKeyIdResult else {
                    return callback(.failure(.errorCreatingSignatureKeyId))
                }

                return self.buildPendingToken(activatedToken: activatedToken, tokenId: tokenId, signatureKeyId: newSignatureKeyId, signatureKeyPair: nil, encryptionKeyPair: encryptionKeyPair, nonce: nonce, traceId: traceId, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
            }
        } else {
            guard case let .success(signatureKeyPair) = keyStore.createSignatureKey(tokenContext: context, tokenId: tokenId) else {
                return callback(.failure(.errorCreatingSignatureKey))
            }

            return buildPendingToken(activatedToken: activatedToken, tokenId: tokenId, signatureKeyId: nil, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, nonce: nonce, traceId: traceId, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
        }
    }

    private func buildPendingToken(activatedToken: ActivatedToken, tokenId: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, nonce: Data, traceId: String, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<PendingToken, TokenStoreError>) -> Void) {
        let context = activatedToken.tokenContext

        debugPrint("Attesting nonce for renewal token \(tokenId)")

        deviceAttestator?.attest(serverGeneratedNonce: nonce, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey) { attestResult in
            switch attestResult {
            case let .failure(error):
                return callback(.failure(.errorAttesting(error.localizedDescription)))
            case let .success(attestObject):
                let pendingNewToken = PendingToken(tokenId: tokenId, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, tokenEncoder: self.tokenEncoder, strainNumber: activatedToken.strainNumber, attestationObject: attestObject, commandTrace: traceId, tokenContext: context)

                activatedToken.renewToken = pendingNewToken

                if let error = self.saveToken(token: activatedToken) {
                    return callback(.failure(.errorSavingToken(error.localizedDescription)))
                }

                debugPrint("Created pending renewal token \(tokenId)")

                return callback(.success(pendingNewToken))
            }
        }
    }

    public func createPendingNewToken(tokenContext context: TokenContext, tokenId: String, nonce: Data, traceId: String, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<PendingToken, TokenStoreError>) -> Void) {
        debugPrint("Generated signature + encryption key pair for new token \(tokenId) for token context id \(context.id)")

        guard case let .success(encryptionKeyPair) = keyStore.createEncryptionKey(tokenContext: context, tokenId: tokenId) else {
            return callback(.failure(.errorCreatingEncryptionKey))
        }

        if #available(iOS 14.0, *) {
            keyStore.createSignatureKey(tokenContext: context, tokenId: tokenId) { signatureKeyIdResult in
                guard case let .success(newSignatureKeyId) = signatureKeyIdResult else {
                    return callback(.failure(.errorCreatingSignatureKeyId))
                }

                return self.buildPendingNewToken(tokenContext: context, tokenId: tokenId, signatureKeyId: newSignatureKeyId, signatureKeyPair: nil, encryptionKeyPair: encryptionKeyPair, nonce: nonce, traceId: traceId, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
            }
        } else {
            guard case let .success(signatureKeyPair) = keyStore.createSignatureKey(tokenContext: context, tokenId: tokenId) else {
                return callback(.failure(.errorCreatingSignatureKey))
            }

            return buildPendingNewToken(tokenContext: context, tokenId: tokenId, signatureKeyId: nil, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, nonce: nonce, traceId: traceId, attestationEncryptionPublicKey: attestationEncryptionPublicKey, onComplete: callback)
        }
    }

    private func buildPendingNewToken(tokenContext context: TokenContext, tokenId: String, signatureKeyId: String?, signatureKeyPair: KeyPair?, encryptionKeyPair: KeyPair, nonce: Data, traceId: String, attestationEncryptionPublicKey: Data, onComplete callback: @escaping (Result<PendingToken, TokenStoreError>) -> Void) {
        deviceAttestator?.attest(serverGeneratedNonce: nonce, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey) { result in
            switch result {
            case let .failure(error):
                return callback(.failure(.errorAttesting(error.localizedDescription)))
            case let .success(attestionObject):
                let pendingNewToken = PendingToken(tokenId: tokenId, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, tokenEncoder: self.tokenEncoder, strainNumber: context.incrementStrainNumber(), attestationObject: attestionObject, commandTrace: traceId, tokenContext: context)

                self.savePendingNewToken(token: pendingNewToken)
                context.token = pendingNewToken

                return callback(.success(pendingNewToken))
            }
        }
    }

    public func clearPendingRenewableToken(token activatedToken: ActivatedToken) {
        let store = TokenPropertyStore(tokenContext: activatedToken.tokenContext)

        guard let pendingRenewalTokenId = store.pendingRenewalTokenId else {
            return
        }

        keyStore.removeToken(tokenContext: activatedToken.tokenContext, tokenId: pendingRenewalTokenId)
        store.removePendingRenewalToken()

        activatedToken.renewToken = nil
    }

    // MARK: Private functions

    private func loadToken(tokenContext context: TokenContext) -> Token? {
        guard let pendingNewToken = loadPendingNewToken(tokenContext: context) else {
            return loadActivatedToken(tokenContext: context)
        }

        return pendingNewToken
    }

    private func loadPendingNewToken(tokenContext context: TokenContext) -> Token? {
        let store = TokenPropertyStore(tokenContext: context)
        guard let pendingTokenId = store.pendingNewTokenId else {
            return nil
        }

        var signatureKeyId: String?
        if #available(iOS 14.0, *) {
            signatureKeyId = keyStore.getSignatureKey(tokenContext: context, tokenId: pendingTokenId)
        }

        guard let signatureKeyPair = keyStore.getSignatureKeyPair(tokenContext: context, tokenId: pendingTokenId), let encryptionKeyPair = keyStore.getEncryptionKeyPair(tokenContext: context, tokenId: pendingTokenId) else {
            return nil
        }

        guard let commandUuid = store.pendingNewTokenCommandUuid, let commandAttestationSerializedData = store.pendingNewTokenCommandAttestation, let commandTrace = store.pendingNewTokenCommandTrace, let commandAttestationType = store.pendingNewTokenCommandAttestationType else {
            return nil
        }

        guard let attestationObjectType = AttestionObjectType(rawValue: commandAttestationType) else {
            return nil
        }

        let strain = context.incrementStrainNumber()
        let pendingAttestionObject = AttestionObject(uuid: commandUuid, type: attestationObjectType, data: commandAttestationSerializedData)
        let attestationEncryptionPublicKey = store.pendingNewAttestationEncryptionPublicKey ?? Data()

        return PendingToken(tokenId: pendingTokenId, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, tokenEncoder: tokenEncoder, strainNumber: strain, attestationObject: pendingAttestionObject, commandTrace: commandTrace, tokenContext: context)
    }

    private func loadActivatedToken(tokenContext context: TokenContext) -> Token? {
        let store = TokenPropertyStore(tokenContext: context)
        guard let tokenId = store.tokenId else {
            return nil
        }

        var signatureKeyPair: KeyPair?
        var signatureKeyId: String?

        if #available(iOS 14.0, *) {
            signatureKeyId = keyStore.getSignatureKey(tokenContext: context, tokenId: tokenId)
        } else {
            guard let signatureKey = keyStore.getSignaturePrivateKey(tokenContext: context, tokenId: tokenId) else {
                return nil
            }

            guard let signaturePublicKey = signatureKey.publicKey else {
                return nil
            }

            signatureKeyPair = KeyPair(privateKey: signatureKey, publicKey: signaturePublicKey)
        }

        guard let encryptionKey = keyStore.getEncryptionPrivateKey(tokenContext: context, tokenId: tokenId) else {
            return nil
        }

        let signatureCertificate = keyStore.getSignatureCertificate(tokenContext: context, tokenId: tokenId)
        let encryptionCertificate = keyStore.getEncryptionCertificate(tokenContext: context, tokenId: tokenId)

        guard let encryptionPublicKey = encryptionKey.publicKey else {
            return nil
        }

        let encryptionKeyPair = KeyPair(privateKey: encryptionKey, publicKey: encryptionPublicKey)

        guard let validityStart = store.tokenValidityStart, let validityEnd = store.tokenValidityEnd else {
            return nil
        }

        let strain = context.incrementStrainNumber()
        let attestationEncryptionPublicKey = store.tokenAttestationEncryptionPublicKey ?? Data()

        let token = ActivatedToken(tokenId: tokenId, signatureKeyId: signatureKeyId, signatureKeyPair: signatureKeyPair, encryptionKeyPair: encryptionKeyPair, attestationEncryptionPublicKey: attestationEncryptionPublicKey, validityStart: validityStart, validityEnd: validityEnd, signatureCertificate: signatureCertificate, encryptionCertificate: encryptionCertificate, tokenEncoder: tokenEncoder, strainNumber: strain, tokenContext: context)

        token.renewToken = loadPendingNewToken(tokenContext: context)

        return token
    }

    private func removeAllExistingTokens(tokenContext context: TokenContext, tokenId: String) {
        removeAllExistingTokens(tokenContext: context, tokenIdsToKeep: [tokenId])
    }

    // Remove all existing tokens keys from preferences, and delete keys for tokens not in argument set.
    private func removeAllExistingTokens(tokenContext context: TokenContext, tokenIdsToKeep ids: [String]) {
        removePreviousActiveToken(tokenContext: context, tokenIdsToKeep: ids)
        removePendingNewToken(tokenContext: context, tokenIdsToKeep: ids)
        removePendingPendingRenewableToken(tokenContext: context, tokenIdsToKeep: ids)
    }

    private func removePreviousActiveToken(tokenContext context: TokenContext, tokenIdsToKeep ids: [String]) {
        let store = TokenPropertyStore(tokenContext: context)
        guard let previousActiveTokenId = store.tokenId else {
            return
        }

        if !ids.contains(previousActiveTokenId) {
            keyStore.removeToken(tokenContext: context, tokenId: previousActiveTokenId)
        }

        store.removePendingNewToken()
    }

    private func removePendingNewToken(tokenContext context: TokenContext, tokenIdsToKeep ids: [String]) {
        let store = TokenPropertyStore(tokenContext: context)
        guard let pendingNewTokenId = store.pendingNewTokenId else {
            return
        }

        if !ids.contains(pendingNewTokenId) {
            keyStore.removeToken(tokenContext: context, tokenId: pendingNewTokenId)
        }

        store.removePendingNewToken()
    }

    private func removePendingPendingRenewableToken(tokenContext context: TokenContext, tokenIdsToKeep ids: [String]) {
        let store = TokenPropertyStore(tokenContext: context)
        guard let pendingRenewableTokenId = store.pendingRenewalTokenId else {
            return
        }

        if !ids.contains(pendingRenewableTokenId) {
            keyStore.removeToken(tokenContext: context, tokenId: pendingRenewableTokenId)
        }

        store.removePendingRenewalToken()
    }
}
