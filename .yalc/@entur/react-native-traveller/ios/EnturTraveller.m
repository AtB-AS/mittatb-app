#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EnturTraveller, NSObject)

RCT_EXTERN_METHOD(attest:(nonnull NSString *)tokenId
                 withNonce:(nonnull NSString *)nonce
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(attestLegacy:(nonnull NSString *)tokenId
                 withNonce:(nonnull NSString *)nonce
                 withServerPublicKey:(nonnull NSString *)serverPublicKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addToken:(nonnull NSString *)tokenId
                 withCertificate:(nonnull NSString *)certificate
                 withTokenValidityStart:(nonnull NSNumber *)tokenValidityStart
                 withTokenValidityEnd:(nonnull NSNumber *)tokenValidityEnd
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getToken:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deleteToken:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateQrCode:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

@end
