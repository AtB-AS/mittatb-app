// TokenCoreModule.java

package no.entur.abt.android.token.core.reactnative;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.protobuf.GeneratedMessageLite;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.DefaultTokenContext;
import no.entur.abt.android.token.DefaultTokenContextsBuilder;
import no.entur.abt.android.token.DefaultTokenPropertyStore;
import no.entur.abt.android.token.DefaultTraceMapper;
import no.entur.abt.android.token.PendingToken;
import no.entur.abt.android.token.Token;
import no.entur.abt.android.token.TokenContext;
import no.entur.abt.android.token.TokenContexts;
import no.entur.abt.android.token.TokenEncoder;
import no.entur.abt.android.token.TokenEncodingRequest;
import no.entur.abt.android.token.TokenStore;
import no.entur.abt.android.token.attestation.DeviceAttestator;
import no.entur.abt.android.token.attestation.DeviceAttestorBuilder;
import no.entur.abt.android.token.core.reactnative.mappers.AbstractMapper;
import no.entur.abt.android.token.core.reactnative.mappers.AbstractPendingTokenMapper;
import no.entur.abt.android.token.core.reactnative.mappers.TokenMapper;
import no.entur.abt.android.token.device.DefaultAttestationStatusProvider;
import no.entur.abt.android.token.device.DefaultDeviceDetailsProvider;
import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.android.token.keystore.DefaultTokenKeyStore;
import no.entur.abt.core.exchange.grpc.traveller.v1.Attestation;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;
import no.entur.abt.exchange.pb.common.MobileTokenReattestationData;
import uk.org.netex.www.netex.TokenAction;

public class TokenCoreModule extends ReactContextBaseJavaModule {

    private static final String HASH_ALGORITHM = "SHA-256";
    private static final byte[] SALT = "SALT_AND_PEPPER_MAKES_FOOD_MORE_TASTY".getBytes(StandardCharsets.UTF_8);

    public static final String PREFERENCES_NAME = "appPrefs";
    private static final long DEFAULT_PREFERENCES_TIMEOUT = 5000;

    private static final String LOG_TAG = TokenCoreModule.class.getName();
    private static final int DEFAULT_DEADLINE_SECONDS = 10000;

    private final ReactApplicationContext reactContext;

    private TokenContexts tokenContexts;
    private TokenStore<String> tokenStore;
    private DeviceAttestator deviceAttestator;
    private DeviceDetailsProvider deviceDetailsProvider;
    private Clock clock;
    private TokenEncoder encoder;
    private SharedPreferences sharedPreferences;

    private Lock preferencesLock = new ReentrantLock();

    private TokenMapper tokenMapper = new TokenMapper();

    public TokenCoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "TokenCore";
    }

    // TODO pass
    @ReactMethod
    public void start(String googleApiKey, ReadableArray tokenContextIds, Promise promise) {
        logInfo("[Native] Function: start");

        if(googleApiKey == null) {
            logInfo("[Native] Expected google api key");
            promise.reject("CODEOO", "Missing google api key");
            return;
        }

        if(tokenContextIds == null || tokenContextIds.size() == 0) {
            logInfo("[Native] Expected at least one token context");
            promise.reject("CODEUU", "Expected at least one token context");
            return;
        }

        try {
            Application application = (Application) reactContext.getApplicationContext();

            sharedPreferences = application.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE);

            DefaultTokenPropertyStore defaultTokenPropertyStore = new DefaultTokenPropertyStore(sharedPreferences, preferencesLock, DEFAULT_PREFERENCES_TIMEOUT);

            DefaultTokenKeyStore keyStore = DefaultTokenKeyStore.newBuilder().build();

            DefaultTokenContextsBuilder defaultTokenContextsBuilder = TokenContexts.newBuilder();

            for (int i = 0; i < tokenContextIds.size(); i++) {
                String id = tokenContextIds.getString(i);

                logInfo("[Native] Add token context " + id);

                defaultTokenContextsBuilder.withContext(DefaultTokenContext.newBuilder().withId(id).build());
            }

            clock = Clock.systemDefaultZone();

            PackageInfo packageInfo = application.getPackageManager().getPackageInfo(application.getPackageName(), 0);
            long versionCode;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                versionCode = packageInfo.getLongVersionCode();
            } else {
                versionCode = packageInfo.versionCode;
            }
            String applicationVersion = packageInfo.versionName + '-' + versionCode;;

            this.tokenContexts = defaultTokenContextsBuilder.build();

            DefaultAttestationStatusProvider attestationStatusProvider = new DefaultAttestationStatusProvider();

            String version = "1.0"; // TODO

            this.deviceDetailsProvider = DefaultDeviceDetailsProvider.newBuilder(application)
                    .withApplicationDeviceInfoElement(application.getPackageName(), applicationVersion, version)
                    .withOsDeviceInfoElement()

                    .withNetworkDeviceStatus()
                    .withBluetoohDeviceStatus()
                    .withNfcDeviceStatus()
                    .withDeviceAttestationDeviceStatus(attestationStatusProvider)

                    .build();

            this.encoder = new TokenEncoder(clock, deviceDetailsProvider);

            this.tokenStore = new TokenStore(keyStore, encoder, clock, null, defaultTokenPropertyStore, new DefaultTraceMapper());

            this.deviceAttestator = DeviceAttestorBuilder.newBuilder()
                    .withContext(application)
                    .withApiKey(googleApiKey)
                    .withDeviceDetailsProvider(deviceDetailsProvider)
                    .withEmulator(EmulatorDetector.isRunningOnEmulator())
                    .withAttestationTimeout(DEFAULT_DEADLINE_SECONDS)
                    .build();

            this.tokenStore.setDeviceAttestator(deviceAttestator);

            // populate contexts in memory
            for (int i = 0; i < tokenContextIds.size(); i++) {
                String id = tokenContextIds.getString(i);
                TokenContext tokenContext = tokenContexts.get(id);

                Token token = tokenStore.getToken(tokenContext);
                if(token != null) {
                    logInfo("[Native] Found " + token.getClass().getSimpleName() + " in context " + id);
                } else {
                    logInfo("[Native] No token found in context " + id);
                }
            }

            promise.resolve(null);
        } catch(Exception e) {
            logInfo("[Native] Error when starting");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void getToken(String tokenContextId, Promise promise) {
        logInfo("[Native] Function: getToken");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }

        Token token = tokenContext.getToken();
        if(token == null) {
            promise.resolve(null);  // TODO or rejected?
            return;
        }

        promise.resolve(tokenMapper.mapToken(token));
    }

    @ReactMethod
    public void encodeAsSecureContainer(String tokenContextId, String tokenId, ReadableArray challenges, ReadableArray tokenActions, boolean includeCertificate, Promise promise) {
        logInfo("[Native] Function: encodeAsSecureContainer");
        Token token = getTokenOrRejectPromise(tokenContextId, tokenId, promise);

        try {
            List<byte[]> c = new ArrayList<>();
            for (int i = 0; i < challenges.size(); i++) {
                String challenge = challenges.getString(i);
                c.add(Base64.decode(challenge, Base64.NO_WRAP));
            }

            TokenAction[] ta = new TokenAction[tokenActions.size()];
            for (int i = 0; i < tokenActions.size(); i++) {
                ta[i] = TokenAction.forNumber(tokenActions.getInt(i));
            }

            TokenEncodingRequest tokenEncodingRequest = new TokenEncodingRequest(c, ta, includeCertificate);
            SecureContainer secureContainer = token.encodeAsSecureContainer(tokenEncodingRequest);

            promise.resolve(AbstractMapper.encode(secureContainer.toByteArray()));
        } catch (Exception e) {
            logInfo("[Native] Error when encoding as secure container");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void clearByContextId(String tokenContextId, Promise promise) {
        logInfo("[Native] Function: clearByContextId");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        try {
            tokenStore.clearToken(tokenContext);

            promise.resolve(null);
        } catch (Exception e) {
            logInfo("[Native] Error when clear by context id");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void createPendingNewToken(String tokenContextId, String tokenId, String nonce, String attestationEncryptionPublicKey, String traceId, Promise promise) {
        logInfo("[Native] Function: createPendingNewToken");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        if(tokenId == null) {
            promise.reject("CODEAA", "");
            return;
        }
        if(nonce == null) {
            promise.reject("CODEBB", "");
            return;
        }
        try {
            PendingToken pendingNewToken = tokenStore.createPendingNewToken(tokenContext, tokenId, Base64.decode(nonce, Base64.NO_WRAP), traceId);

            logInfo("[Native] Created pending new token");

            WritableNativeMap writableNativeMap = tokenMapper.mapToken(pendingNewToken);

            logInfo("[Native] Mapped pending new token");

            promise.resolve(writableNativeMap);

            logInfo("[Native] Returned pending new token");
        } catch (Exception e) {
            logInfo("[Native] Error when create new pending token");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void convertPendingNewTokenToActiveToken(String tokenContextId, String tokenId, String certificate, Double validityStart, Double validityEnd, Promise promise) {
        logInfo("[Native] Function: convertPendingNewTokenToActiveToken");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }

        Token token = tokenContext.getToken();
        if(token == null) {
            promise.reject("CODEXX", "");
            return;
        }

        if (!(token instanceof PendingToken)) {
            promise.reject("CODEYY", "");
            return;
        }

        PendingToken p = (PendingToken) token;
        if (!p.getTokenId().equals(tokenId)) {
            promise.reject("CODEZZ", "");
            return;
        }
        try {
            ActivatedToken activatedToken = tokenStore.convertPendingTokenToActiveToken(p,
                    Base64.decode(certificate, Base64.NO_WRAP),
                    Instant.ofEpochSecond(validityStart.longValue()),
                    Instant.ofEpochSecond(validityEnd.longValue()));

            logInfo("[Native] Created new active token");

            promise.resolve(tokenMapper.mapToken(activatedToken));

            logInfo("[Native] Returned new actived token");
        } catch (Exception e) {
            logInfo("[Native] Error when converting pending new token to active token");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void createPendingRenewToken(String tokenContextId, String activateTokenId, String pendingTokenId, String nonce, String attestationEncryptionPublicKey, String traceId, Promise promise) {
        logInfo("[Native] Function: createPendingRenewToken");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        Token token = tokenContext.getToken();
        if(token == null) {
            promise.reject("CODEXX", "");
            return;
        }
        if(!token.getTokenId().equals(activateTokenId)) {
            promise.reject("CODEAAA", "");
            return;
        }

        ActivatedToken<String> activatedToken = (ActivatedToken<String>) token;

        try {
            PendingToken pendingToken = tokenStore.createPendingToken(activatedToken, pendingTokenId, Base64.decode(nonce, Base64.NO_WRAP), traceId);

            logInfo("[Native] Created pending renew token");

            WritableNativeMap writableNativeMap = tokenMapper.mapToken(pendingToken);

            logInfo("[Native] Mapped pending renew token");

            promise.resolve(writableNativeMap);

            logInfo("[Native] Returned pending renew token");
        } catch (Exception e) {
            logInfo("[Native] Error when create pending renew token");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void convertPendingRenewTokenToActiveToken(String tokenContextId, String activateTokenId, String pendingTokenId, String certificate, Double validityStart, Double validityEnd, Promise promise) {
        logInfo("[Native] Function: convertPendingRenewTokenToActiveToken");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        Token token = tokenContext.getToken();
        if(token == null) {
            promise.reject("CODEXX", "");
            return;
        }
        if(!token.getTokenId().equals(activateTokenId)) {
            promise.reject("CODEAAA", "");
            return;
        }

        ActivatedToken<String> activatedToken = (ActivatedToken<String>) token;
        Token<String> renewToken = activatedToken.getRenewToken();
        if(renewToken == null) {
            promise.reject("CODEXAAX", "");
            return;
        }
        if(!renewToken.getTokenId().equals(pendingTokenId)) {
            promise.reject("CODEAAAAAA", "");
            return;
        }

        try {
            logInfo("[Native] Convert pending renew token " + pendingTokenId + " to active");

            ActivatedToken next = tokenStore.convertPendingTokenToActiveToken(activatedToken, (PendingToken<String>)renewToken,
                    Base64.decode(certificate, Base64.NO_WRAP),
                    Instant.ofEpochSecond(validityStart.longValue()),
                    Instant.ofEpochSecond(validityEnd.longValue()));

            WritableNativeMap writableNativeMap = tokenMapper.mapToken(next);

            logInfo("[Native] Got activated token");

            promise.resolve(writableNativeMap);

            logInfo("[Native] Returned activated token");
        } catch (Exception e) {
            logInfo("[Native] Error when converting pending renew token to active");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void buildReattestation(String tokenContextId, String tokenId, String reattestationData, Promise promise) {
        logInfo("[Native] Function: buildReattestation");
        Token signingToken = getTokenOrRejectPromise(tokenContextId, tokenId, promise);

        try {
            PublicKey signaturePublicKey = signingToken.getSignaturePublicKey();
            PublicKey encryptPublicKey = signingToken.getEncryptPublicKey();

            MobileTokenReattestationData rd = MobileTokenReattestationData.parseFrom(Base64.decode(reattestationData, Base64.NO_WRAP));

            byte[] nonce = rd.getNonce().toByteArray();

            GeneratedMessageLite attestation = deviceAttestator.attest(nonce, signaturePublicKey.getEncoded(), encryptPublicKey.getEncoded());

            WritableNativeMap map = new WritableNativeMap();

            map.putString("data", AbstractMapper.encode(attestation.toByteArray()));
            map.putString("type", AbstractPendingTokenMapper.getAttetationType(attestation));

            promise.resolve(map);

            logInfo("[Native] Returned reattestation data");
        } catch (Exception e) {
            logInfo("[Native] Error when creating reattestation data");
            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    private Token getTokenOrRejectPromise(String tokenContextId, String tokenId, Promise promise) {
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return null;
        }
        Token token = tokenContext.getToken();
        if(token == null) {
            promise.reject("CODEXX", "");
            return null;
        }

        Token targetToken = null;
        if(token.getTokenId().equals(tokenId)) {
            targetToken = token;
        } else if(token instanceof ActivatedToken) {
            // was this a request for a pending renew token?
            ActivatedToken activatedToken = (ActivatedToken) token;
            Token renewToken = activatedToken.getRenewToken();
            if(renewToken != null) {
                if(renewToken.getTokenId().equals(tokenId)) {
                    targetToken = renewToken;
                }
            }
        }

        if(targetToken == null) {
            promise.reject("CODEAAA", "");
            return null;
        }
        return targetToken;
    }

    @ReactMethod
    public void convertPendingTokenToActiveTokenWhichMustBeRenewed(String tokenContextId, String activateTokenId, String pendingTokenId, String attestationEncryptionPublicKey, Promise promise) {
        logInfo("[Native] Function: convertPendingTokenToActiveTokenWhichMustBeRenewed");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        Token token = tokenContext.getToken();
        if(token == null) {
            promise.reject("CODEXX", "");
            return;
        }
        if(!token.getTokenId().equals(activateTokenId)) {
            promise.reject("CODEAAA", "");
            return;
        }

        ActivatedToken<String> activatedToken = (ActivatedToken<String>) token;
        Token<String> renewToken = activatedToken.getRenewToken();
        if(renewToken == null) {
            promise.reject("CODEXAAX", "");
            return;
        }

        if(!renewToken.getTokenId().equals(pendingTokenId)) {
            promise.reject("CODEAAAAAA", "");
            return;
        }

        try {
            ActivatedToken<String> mustBeRenewed = tokenStore.convertPendingTokenToActiveTokenWhichMustBeRenewed(activatedToken, (PendingToken<String>) renewToken);

            promise.resolve(tokenMapper.mapToken(mustBeRenewed));

            logInfo("[Native] Converted pending renew token to active token which must be renewed");
        } catch (Exception e) {
            logInfo("[Native] Error when converting pending renew token to active token which must be renewed");

            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void clearPendingRenewableToken(String tokenContextId, String activateTokenId, Promise promise) {
        logInfo("[Native] Function: clearPendingRenewableToken");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if (tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        Token token = tokenContext.getToken();
        if (token == null) {
            promise.reject("CODEXX", "");
            return;
        }

        if (!token.getTokenId().equals(activateTokenId)) {
            promise.reject("CODEAAA", "");
            return;
        }

        try {
            tokenStore.clearPendingRenewableToken((ActivatedToken<String>) token);

            promise.resolve(null);

            logInfo("[Native] Cleared pending renewable token");
        } catch (Exception e) {
            logInfo("[Native] Error when clearing pending renewable token");

            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void isEmulator(Promise promise) {
        promise.resolve(EmulatorDetector.isRunningOnEmulator());
    }

    // bluetooth nonce can be null or empty
    @ReactMethod
    public void decryptAndEncodeNonceAsVisualCode(String tokenContextId, String tokenId, String encryptedNonce, String bluetoothNonce, Promise promise) {
        logInfo("[Native] Function: decryptAndEncodeNonceAsVisualCode");
        TokenContext tokenContext = tokenContexts.get(tokenContextId);
        if(tokenContext == null) {
            promise.reject("CODEOO", "");
            return;
        }
        Token token = tokenContext.getToken();
        if(token == null) {
            promise.reject("CODEXX", "");
            return;
        }
        if(!token.getTokenId().equals(tokenId)) {
            promise.reject("CODEAAA", "");
            return;
        }

        try {
            // note order:
            // challenge nonce bytes first, then time-based nonce bytes
            ByteArrayOutputStream bout = new ByteArrayOutputStream();
            if(bluetoothNonce != null && !bluetoothNonce.isEmpty()) {
                bout.write(Base64.decode(bluetoothNonce, Base64.NO_WRAP));
            }
            bout.write(token.decryptVisualInspectionNonce(Base64.decode(encryptedNonce, Base64.NO_WRAP)));

            promise.resolve(AbstractMapper.encode(getDigest(bout.toByteArray(), SALT)));

            logInfo("[Native] Returned decrypted + encoded visual code");
        } catch (Exception e) {
            logInfo("[Native] Error when returning decrypted + encoded visual inspection nonce");

            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    @ReactMethod
    public void encodeNonceAsVisualCode(String nonce, Promise promise) {
        try {
            byte[] bytes = getDigest(Base64.decode(nonce, Base64.NO_WRAP), SALT);

            promise.resolve(AbstractMapper.encode(bytes));

            logInfo("[Native] Returned digest");
        } catch (Exception e) {
            logInfo("[Native] Error when returning digest");

            promise.reject(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    public static byte[]  getDigest(byte[] visualInspectionNonce, byte[] salt) {

        try {
            // Create 256 bit hash using SHA-256
            MessageDigest md = MessageDigest.getInstance(HASH_ALGORITHM);
            md.update(salt);
            md.update(visualInspectionNonce);
            return md.digest();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Hashing algorithm not supported: " + HASH_ALGORITHM, ex);
        }
    }

    private void logInfo(String msg) {
        WritableNativeMap payload = new WritableNativeMap();
        payload.putString("message", msg);
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("abtClientNativeLog", payload);
    }


}
