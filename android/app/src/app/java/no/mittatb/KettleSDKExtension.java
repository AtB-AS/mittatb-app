package no.mittatb;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = KettleSDKExtension.NAME)
public class KettleSDKExtension extends ReactContextBaseJavaModule {
    public static final String NAME = "KettleSDKExtension";

    KettleSDKExtension(ReactApplicationContext context) {
        super(context);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void initializeKettleSDK() {}
}
