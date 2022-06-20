// ChallengeModule.java

package no.entur.abt.client.sdk.challenge.bridge;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.Provider;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.time.Clock;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import no.entur.abt.android.bluetooth.BluetoothChallengeReceiver;
import no.entur.abt.android.bluetooth.ChallengeListener;
import no.entur.abt.android.bluetooth.ChallengeReceiver;
import no.entur.abt.android.bluetooth.format.Challenge;
import no.entur.abt.android.bluetooth.format.ChallengePublicKeyParser;
import no.entur.abt.android.bluetooth.format.ChallengeVerifier;
import no.entur.abt.android.bluetooth.format.SignedChallenge;
import no.entur.abt.android.bluetooth.format.v1.ChallengeBinaryFormat;
import no.entur.abt.client.sdk.challenge.bridge.mapper.SignedChallengeMapper;

public class BluetoothChallengeModule extends ReactContextBaseJavaModule implements ChallengeListener {

    private final static String TAG = BluetoothChallengeModule.class.getName();

    private final ReactApplicationContext reactContext;

    protected Provider provider = null;
    protected Clock clock;
    protected ChallengeReceiver challengeReceiver;
    protected SignedChallengeMapper signedChallengeMapper = new SignedChallengeMapper();

    public BluetoothChallengeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.clock = Clock.systemUTC();
    }

    @Override
    public String getName() {
        return "ChallengeModule";
    }

    @ReactMethod
    public void start(ReadableArray publicKeys, Promise promise) {
        try {
            List<byte[]> buffers = new ArrayList<>();
            for (int i = 0; i < publicKeys.size(); i++) {
                String certificate = publicKeys.getString(i);
                String base64 = ChallengePublicKeyParser.parsePublicKeyFromEncodedPublicKey(certificate);
                buffers.add(decode(base64));
            }

            challengeReceiver = createChallengeReceiver(buffers);
            challengeReceiver.onResume();
            promise.resolve(null);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void stop(Promise promise) {
        try {
            if(challengeReceiver != null) {
                challengeReceiver.onPause();
                challengeReceiver = null;
            }
            promise.resolve(null);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    private byte[] decode(String str) {
        return Base64.decode(str, Base64.NO_WRAP);
    }

    protected ChallengeReceiver createChallengeReceiver(List<byte[]> buffers) {
        Context context = getReactApplicationContext().getApplicationContext();

        ChallengeReceiver newChallengeReceiver = null;

        BluetoothManager bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();

        if (bluetoothAdapter != null) {
            ChallengeBinaryFormat format = new ChallengeBinaryFormat();

            ChallengeVerifier challengeVerifier = ChallengeVerifier.newBuilder()
                    .withParsers(format)
                    .withPublicKeys(parse(buffers))
                    .withClock(clock)
                    .withTransport(Challenge.TRANSPORT_BLUETOOTH_BROADCAST)
                    .build();

            newChallengeReceiver = new BluetoothChallengeReceiver(context, bluetoothAdapter, clock, challengeVerifier);
        } else if (bluetoothAdapter == null) {
            newChallengeReceiver = new no.entur.abt.android.common.bluetooth.EmulatorChallengeReceiver(clock, new Handler()); // TODO fix thread pool instead
        }
        return newChallengeReceiver;
    }

    private List<PublicKey> parse(List<byte[]> buffers) {
        List<PublicKey> publicKeys = new ArrayList<>();
        for (byte[] buffer : buffers) {
            try {
                publicKeys.add(loadPublicKey(buffer));
            } catch (Exception e) {
                Log.d(TAG, "Unable to parse", e);
            }
        }
        return publicKeys;
    }

    private PublicKey loadPublicKey(byte[] buffer) throws NoSuchAlgorithmException, InvalidKeySpecException {
        X509EncodedKeySpec spec = new X509EncodedKeySpec(buffer);
        KeyFactory keyFactory = getKeyFactory();
        return keyFactory.generatePublic(spec);
    }

    private KeyFactory getKeyFactory() throws NoSuchAlgorithmException {
        KeyFactory keyFactory;
        if (provider != null) {
            keyFactory = KeyFactory.getInstance("EC", provider);
        } else {
            keyFactory = KeyFactory.getInstance("EC");
        }
        return keyFactory;
    }

    @Override
    public void onChallengeReceived(Collection<SignedChallenge> challengesReceived) {
        Log.d(TAG, "Bluetooth challenge received");

        WritableNativeArray array = new WritableNativeArray();
        for (SignedChallenge signedChallenge : challengesReceived) {
            array.pushMap(signedChallengeMapper.map(signedChallenge));
        }
        sendEvent("bluetoothChallenges", array);
    }

    @Override
    public void onScanFailed(int errorCode) {
        Log.d(TAG, "Bluetooth scan failed " + errorCode);

        WritableNativeMap map = new WritableNativeMap();
        map.putInt("errorCode", errorCode);

        sendEvent("bluetoothScanFailed", null);
    }

    @Override
    public void onBluetoothDisasbled() {
        Log.d(TAG, "Bluetooth was disabled");

        sendEvent("bluetoothDisabled", null);
    }

    private void sendEvent(String eventName, Object params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
