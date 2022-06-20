#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(TokenCore, TokenCoreModule, NSObject)

RCT_EXTERN_METHOD(start:(nonnull NSString *)unsusedApiKey
                 withContexts:(NSArray)contexts
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createPendingNewToken:(nonnull NSString *)tokenContextId
                 withTokenId:(NSString*)tokenId
                 withNonce:(NSString*)nonce
                 withAttestationEncryptionPublicKey:(NSString*)attestationEncryptionPublicKey
                 withTraceId:(NSString*)traceId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearByContextId:(nonnull NSString *)tokenContextId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(convertPendingNewTokenToActiveToken:(nonnull NSString *)tokenContextId
                  withTokenId:(NSString *)tokenId
                  withCertificate:(NSString *)certificate
                  withValidityStart:(double)validityStart
                  withValidityEnd:(double)ValidityEnd
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearPendingRenewableToken:(nonnull NSString *)tokenContextId
                  withActivateTokenId:(NSString *)activateTokenId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getToken:(nonnull NSString *)tokenContextId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(encodeAsSecureContainer:(nonnull NSString *)tokenContextId
                  withTokenId:(NSString *)tokenId
                  withChallenges:(NSArray *)challenges
                  withTokenActions:(NSArray *)tokenActions
                  withIncludeCertificate:(BOOL)includeCertificate
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createPendingRenewToken:(nonnull NSString *)tokenContextId
                  withActivateTokenId:(NSString*)activateTokenId
                  withPendingTokenId:(NSString*)pendingTokenId
                  withNonce:(NSString*)nonce
                  withAttestationEncryptionPublicKey:(NSString*)attestationEncryptionPublicKey
                  withTraceId:(NSString*)traceId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(convertPendingRenewTokenToActiveToken:(nonnull NSString *)tokenContextId
                  withActivateTokenId:(NSString *)activateTokenId
                  withPendingTokenId:(NSString *)pendingTokenId
                  withCertificate:(NSString *)certificate
                  withValidityStart:(double)validityStart
                  withValidityEnd:(double)ValidityEnd
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(convertPendingTokenToActiveTokenWhichMustBeRenewed:(nonnull NSString *)tokenContextId
                  withActivateTokenId:(NSString *)activateTokenId
                  withPendingTokenId:(NSString *)pendingTokenId
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(buildReattestation:(nonnull NSString *)tokenContextId
                  withTokenId:(NSString *)tokenId
                  withReattestationData:(NSString *)reattestationData
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isEmulator:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(decryptVisualInspectionNonce:(nonnull NSString *)tokenContextId
                  withTokenId:(NSString *)tokenId
                  withEncryptedVisualInspectionNonce:(NSString *)encryptedVisualInspectionNonce
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
@end
