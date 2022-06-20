import AbtTokenCoreSDK
import DeviceCheck
@_implementationOnly import Kronos

public protocol IdentifiableError {
    var code: String { get }
    var message: String { get }
}

public enum TokenCoreModuleError: Error {
    case errorTokenNotFound
    case errorContextNotFound
    case errorTokenIdNotFound(_ tokenId: String)
    case errorCastingToken(_ castType: AnyClass)
}

extension TokenCoreModuleError: IdentifiableError {
    public var code: String {
        switch self {
        case .errorTokenNotFound:
            return "CODEAA"
        case .errorContextNotFound:
            return "CODEBB"
        case .errorTokenIdNotFound:
            return "CODECC"
        case .errorCastingToken:
            return "CODEDD"
        }
    }

    public var message: String {
        switch self {
        case let .errorTokenIdNotFound(tokenId):
            return "Token id is not the same as \(tokenId)"
        case let .errorCastingToken(objectType):
            return "Token invalid while casting to \(objectType.self)"
        default:
            return "Error \(code)"
        }
    }
}

@objc(TokenCoreModule)
public class TokenCoreModule: NSObject {
    private var contexts: TokenContexts
    private var keyStoreAliasFactory: DefaultKeyStoreAliasFactory!
    private var keyStoreSearch: DefaultKeystoreSearch!
    private var tokenKeyStore: DefaultTokenKeyStore!
    private var tokenEncoder: TokenEncoder!
    private var tokenStore: TokenStore!
    private var iOSDeviceAttestator: IOSDeviceAttestator!

    override public init() {
        contexts = TokenContexts()
        Clock.sync()

        keyStoreAliasFactory = DefaultKeyStoreAliasFactory()
        keyStoreSearch = DefaultKeystoreSearch(keystoreAliasFactory: keyStoreAliasFactory)
        tokenKeyStore = DefaultTokenKeyStore(keyAliasFactory: keyStoreAliasFactory, keyStoreSearch: keyStoreSearch)
        tokenEncoder = TokenEncoder()
        tokenStore = TokenStore(tokenKeyStore: tokenKeyStore, tokenEncoder: tokenEncoder)
        iOSDeviceAttestator = IOSDeviceAttestator()

        tokenStore.setDeviceAttestator(iOSDeviceAttestator)
    }

    @objc(start:withContexts:withResolver:withRejecter:)
    func start(_: String, contexts contextIds: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !contextIds.isEmpty else {
            return reject("CODEUU", "Expected at least one token context", nil)
        }

        for contextId in contextIds {
            if contexts.getContext(key: contextId) == nil {
                contexts.add(id: contextId)

                guard let tokenContext = contexts.getContext(key: contextId) else {
                    continue
                }

                let token = tokenStore.getToken(tokenContext: tokenContext)
                if let token = token {
                    debugPrint("Found \(token) in context \(tokenContext)")
                } else {
                    debugPrint("No Token was found in context \(tokenContext)")
                }
            }
        }

        resolve(nil)
    }

    @objc(clearByContextId:withResolver:withRejecter:)
    func clearByContextId(tokenContextId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        tokenStore.clearToken(tokenContext: tokenContext)

        resolve(nil)
    }

    @objc(convertPendingTokenToActiveTokenWhichMustBeRenewed:withActivateTokenId:withPendingTokenId:withResolver:withRejecter:)
    func convertPendingTokenToActiveTokenWhichMustBeRenewed(tokenContextId: String, activateTokenId: String, pendingTokenId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let token: Token
        switch getToken(tokenContextId: tokenContextId, andMatchTokenId: activateTokenId) {
        case let .success(object):
            token = object
        case let .failure(error):
            return rejectWithError(error, to: reject)
        }

        guard let activateToken = token as? ActivatedToken else {
            return rejectWithError(.errorCastingToken(ActivatedToken.self), to: reject)
        }

        guard let renewToken = activateToken.renewToken else {
            return reject("CODECC", "Token \(activateToken.tokenId) does not has a renew Token", nil)
        }

        guard renewToken.tokenId == pendingTokenId else {
            return reject("CODEDD", "Renew Token id is not the same as \(pendingTokenId)", nil)
        }

        guard let pendingToken = renewToken as? PendingToken else {
            return reject("CODEEE", "Token \(renewToken.tokenId) invalid cast to PendingToken", nil)
        }

        guard let mustBeRenewed = tokenStore.convertPendingTokenToActiveTokenWhichMustBeRenewed(activatedToken: activateToken, pendingToken: pendingToken) else {
            return reject("CODEFF", "Error while converting PendingToken to ActiveToken which must be renewed", nil)
        }

        return resolve(mustBeRenewed.toMap())
    }

    @objc(buildReattestation:withTokenId:withReattestationData:withResolver:withRejecter:)
    func buildReattestation(tokenContextId: String, tokenId: String, reattestationData: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = getActivatedOrRenewToken(tokenContext: tokenContext, tokenId: tokenId) else {
            return reject("CODEXX", "Token was not found", nil)
        }

        debugPrint("KeyID: \(token.signatureKeyId) for TOKEN: \(token.tokenId) (Re-attesting)")

        iOSDeviceAttestator.reAttest(reattestationData: reattestationData, signatureKeyId: token.signatureKeyId, signatureKeyPair: token.signatureKeyPair, encryptionKeyPair: token.encryptionKeyPair) { result in
            guard case let .success(attestionObject) = result else {
                return reject("CODECC", "Error while building reattestation data", nil)
            }

            let map = attestionObject.toMap()
            debugPrint(map)

            return resolve(map)
        }
    }

    @objc(clearPendingRenewableToken:withActivateTokenId:withResolver:withRejecter:)
    func clearPendingRenewableToken(tokenContextId: String, activateTokenId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = tokenContext.token else {
            return reject("CODEXX", "No Token was present in the context", nil)
        }

        guard token.tokenId == activateTokenId else {
            return reject("CODEAA", "PendingToken id is not the same as \(activateTokenId)", nil)
        }

        guard let activateToken = token as? ActivatedToken else {
            return reject("CODEBB", "Token \(token.tokenId) invalid cast to ActivatedToken", nil)
        }

        tokenStore.clearPendingRenewableToken(token: activateToken)

        return resolve(nil)
    }

    @objc(convertPendingNewTokenToActiveToken:withTokenId:withCertificate:withValidityStart:withValidityEnd:withResolver:withRejecter:)
    func convertPendingNewTokenToActiveToken(tokenContextId: String, tokenId: String, certificate: String, validityStart: Double, validityEnd: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = tokenContext.token else {
            return reject("CODEXX", "No Token was present in the context", nil)
        }

        guard let pendingToken = token as? PendingToken else {
            return reject("CODEYY", "Token can not be converted to PendingToken", nil)
        }

        guard pendingToken.tokenId == tokenId else {
            return reject("CODEZZ", "PendingToken id is not the same as \(tokenId)", nil)
        }

        guard let certificateData = certificate.decodedBase64 else {
            return reject("CODEQQ", "Error while decoding base64 certificate", nil)
        }

        guard let activatedToken = tokenStore.convertPendingTokenToActiveToken(token: pendingToken, certificate: certificateData, validityStart: Date(timeIntervalSince1970: validityStart), validityEnd: Date(timeIntervalSince1970: validityEnd)) else {
            return reject("CODEWW", "Error while converting PendingToken to ActiveToken", nil)
        }

        return resolve(activatedToken.toMap())
    }

    @objc(createPendingNewToken:withTokenId:withNonce:withAttestationEncryptionPublicKey:withTraceId:withResolver:withRejecter:)
    func createPendingNewToken(tokenContextId: String, tokenId: String, nonce: String, attestationEncryptionPublicKey: String, traceId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let decodedNonceData = nonce.decodedBase64 else {
            return reject("CODEOO", "Error while decoding base64 nonce", nil)
        }

        let decodedAttestationEncryptionPublicKey = attestationEncryptionPublicKey.decodedBase64 ?? Data()

        tokenStore.createPendingNewToken(tokenContext: tokenContext, tokenId: tokenId, nonce: decodedNonceData, traceId: traceId, attestationEncryptionPublicKey: decodedAttestationEncryptionPublicKey, onComplete: { result in
            switch result {
            case let .success(pendingToken):
                let mapData = pendingToken.toMap()
                return resolve(mapData)
            case let .failure(error):
                return reject("CODEOO", "Error creating new PendingToken", error)
            }
        })
    }

    @objc(getToken:withResolver:withRejecter:)
    func getToken(tokenContextId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = tokenContext.token else {
            return resolve(nil)
        }

        debugPrint(token)
        debugPrint(token.toMap())

        return resolve(token.toMap())
    }

    @objc(encodeAsSecureContainer:withTokenId:withChallenges:withTokenActions:withIncludeCertificate:withResolver:withRejecter:)
    func encodeAsSecureContainer(tokenContextId: String, tokenId: String, challenges: NSArray, tokenActions: NSArray, includeCertificate: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = getActivatedOrRenewToken(tokenContext: tokenContext, tokenId: tokenId) else {
            return reject("CODEXX", "Token was not found", nil)
        }

        let decodedChallenges = challenges.compactMap { ($0 as? String)?.decodedBase64 }
        let tokenPayloadActions: [TokenPayloadAction] = tokenActions.compactMap {
            guard let payloadAction = $0 as? Int else {
                return nil
            }

            return TokenPayloadAction(rawValue: payloadAction)
        }

        let tokenEncodingRequest = TokenEncodingRequest(challenges: decodedChallenges, tokenActions: tokenPayloadActions, includeCertificate: includeCertificate)

        token.encodeAsSecureContainer(tokenEncodingRequest: tokenEncodingRequest) { secureContainerWrapper in
            guard let ecodedBase64SecureContainer = secureContainerWrapper?.base64EncodedString else {
                return reject("CODEBB", "Error while encoding secure container", nil)
            }

            return resolve(ecodedBase64SecureContainer)
        }
    }

    @objc(createPendingRenewToken:withActivateTokenId:withPendingTokenId:withNonce:withAttestationEncryptionPublicKey:withTraceId:withResolver:withRejecter:)
    func createPendingRenewToken(tokenContextId: String, activateTokenId: String, pendingTokenId: String, nonce: String, attestationEncryptionPublicKey: String, traceId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = tokenContext.token else {
            return reject("CODEXX", "Token was not found", nil)
        }

        guard token.tokenId == activateTokenId else {
            return reject("CODEAA", "Token \(token.tokenId) is not equals to \(activateTokenId)", nil)
        }

        guard let activatedToken = token as? ActivatedToken else {
            return reject("CODEBB", "Token \(token.tokenId) invalid cast to ActivatedToken", nil)
        }

        guard let decodedNonce = nonce.decodedBase64 else {
            return reject("CODECC", "Error while decoding nonce", nil)
        }

        let decodedAttestationEncryptionPublicKey = attestationEncryptionPublicKey.decodedBase64 ?? Data()

        tokenStore.createPendingToken(activatedToken: activatedToken, tokenId: pendingTokenId, nonce: decodedNonce, traceId: traceId, attestationEncryptionPublicKey: decodedAttestationEncryptionPublicKey) { pendingTokenResult in
            switch pendingTokenResult {
            case let .success(pendingToken):
                let pendingTokenMap = pendingToken.toMap()
                debugPrint(pendingTokenMap)
                return resolve(pendingTokenMap)
            case let .failure(error):
                return reject("CODEDD", "Error while creating renew PendingToken", error)
            }
        }
    }

    @objc(convertPendingRenewTokenToActiveToken:withActivateTokenId:withPendingTokenId:withCertificate:withValidityStart:withValidityEnd:withResolver:withRejecter:)
    func convertPendingRenewTokenToActiveToken(tokenContextId: String, activateTokenId: String, pendingTokenId: String, certificate: String, validityStart: Double, validityEnd: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = tokenContext.token else {
            return reject("CODEXX", "No Token present in the context", nil)
        }

        guard token.tokenId == activateTokenId else {
            return reject("CODEAA", "Token id is not the same as \(activateTokenId)", nil)
        }

        guard let activatedToken = token as? ActivatedToken else {
            return reject("CODEYY", "Error Token can not be converted to PendingToken", nil)
        }

        guard let renewToken = activatedToken.renewToken as? PendingToken else {
            return reject("CODEXAAX", "Renew no Token was not found", nil)
        }

        guard renewToken.tokenId == pendingTokenId else {
            return reject("CODEAAAAAA", "Token id is not the same as \(pendingTokenId)", nil)
        }

        guard let certificateData = certificate.decodedBase64 else {
            return reject("CODEQQ", "Error while decoding base64 certificate", nil)
        }

        guard let next = tokenStore.convertPendingTokenToActiveToken(activatedToken: activatedToken, token: renewToken, certificate: certificateData, validityStart: Date(timeIntervalSince1970: validityStart), validityEnd: Date(timeIntervalSince1970: validityEnd)) else {
            return reject("CODEWW", "Error while converting PendingToken to ActiveToken", nil)
        }

        debugPrint(next.toMap())

        return resolve(next.toMap())
    }

    @objc(isEmulator:withRejecter:)
    func isEmulator(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        #if targetEnvironment(simulator)
            return resolve(true)
        #else
            return resolve(false)
        #endif
    }

    @objc(decryptVisualInspectionNonce:withTokenId:withEncryptedVisualInspectionNonce:withResolver:withRejecter:)
    func decryptVisualInspectionNonce(tokenContextId: String, tokenId: String, encryptedVisualInspectionNonce nonce: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let tokenContext = contexts.getContext(key: tokenContextId) else {
            return reject("CODEOO", "Invalid Token context id", nil)
        }

        guard let token = tokenContext.token else {
            return reject("CODEXX", "No Token present in the context", nil)
        }

        guard token.tokenId == tokenId else {
            return reject("CODEAA", "Token id is not the same as \(tokenId)", nil)
        }

        guard let decodedNonce = nonce.decodedBase64 else {
            return reject("CODECC", "Error while decoding nonce", nil)
        }

        guard let decryptedNonce = token.decryptVisualInspectionNonce(decodedNonce) else {
            return reject("CODECC", "Error while decrypting visual inspection nonce", nil)
        }

        return resolve(decryptedNonce.base64EncodedString)
    }

    // MARK: Private functions

    private func getActivatedOrRenewToken(tokenContext context: TokenContext, tokenId: String) -> Token? {
        guard let token = context.token else {
            return nil
        }

        if token.tokenId == tokenId {
            return token
        }

        if let activatedToken = token as? ActivatedToken, let renewToken = activatedToken.renewToken, renewToken.tokenId == tokenId {
            return renewToken
        }

        return nil
    }

    private func getTokenContext(tokenContextId contextId: String) -> Result<TokenContext, TokenCoreModuleError> {
        guard let tokenContext = contexts.getContext(key: contextId) else {
            return .failure(.errorContextNotFound)
        }

        return .success(tokenContext)
    }

    private func getToken(tokenContextId contextId: String, andMatchTokenId tokenId: String? = nil) -> Result<Token, TokenCoreModuleError> {
        switch getTokenContext(tokenContextId: contextId) {
        case let .success(tokenContext):
            guard let token = tokenContext.token else {
                return .failure(.errorTokenNotFound)
            }

            // Check if token id match
            if let tokenId = tokenId, token.tokenId != tokenId {
                return .failure(.errorTokenIdNotFound(tokenId))
            }

            return .success(token)
        case let .failure(error):
            return .failure(error)
        }
    }

    private func rejectWithError(_ error: TokenCoreModuleError, to reject: @escaping RCTPromiseRejectBlock) {
        reject(error.code, error.message, error)
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        false
    }
}
