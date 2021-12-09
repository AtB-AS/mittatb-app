#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EnturTraveller, NSObject)

RCT_EXTERN_METHOD(start:(nonnull NSString *)unsusedApiKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(attest:(nonnull NSString *)accountId
                 withTokenId:(nonnull NSString *)tokenId
                 withNonce:(nonnull NSString *)nonce
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(attestLegacy:(nonnull NSString *)accountId
                 withTokenId:(nonnull NSString *)tokenId
                 withNonce:(nonnull NSString *)nonce
                 withServerPublicKey:(nonnull NSString *)serverPublicKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addToken:(nonnull NSString *)accountId
                 withTokenId:(nonnull NSString *)tokenId
                 withCertificate:(nonnull NSString *)certificate
                 withTokenValidityStart:(nonnull NSNumber *)tokenValidityStart
                 withTokenValidityEnd:(nonnull NSNumber *)tokenValidityEnd
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getToken:(nonnull NSString *)accountId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deleteToken:(nonnull NSString *)accountId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDeviceName:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSecureToken:(nonnull NSString *)accountId
                 withTokenId:(nonnull NSString *)tokenId
                 withIncludeCertificate:(nonnull BOOL *)includeCertificate
                 withActions:(nonnull NSArray *)actions
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateAssertion:(nonnull NSString *)accountId
                 withKeyId(nonnull NSString *)keyId
                 withNonce:(nonnull NSString *)nonce
                 withTokenId:(nonnull NSString *)tokenId
                 withHash:(nonnull NSString *)hash
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAttestationSupport:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

@end
