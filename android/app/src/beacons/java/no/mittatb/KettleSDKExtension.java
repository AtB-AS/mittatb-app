package no.mittatb;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.kogenta.kettle.common.config.KettleConfig;
import com.kogenta.kettle.common.logging.LogLevel;
import com.kogenta.kettle.sdk.Kettle;

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
    public void initializeKettleSDK(Promise promise) {
        if (BuildConfig.KETTLE_API_KEY != null && !BuildConfig.KETTLE_API_KEY.isEmpty()) {
            KettleConfig kettleConfig = new KettleConfig();
            if (BuildConfig.DEBUG) {
                kettleConfig.setDevelopmentApiKey(BuildConfig.KETTLE_API_KEY);
                kettleConfig.setDevelopmentLogLevel(LogLevel.TRACE);
                kettleConfig.setInProduction(false);
            } else {
                kettleConfig.setProductionApiKey(BuildConfig.KETTLE_API_KEY);
                kettleConfig.setProductionLogLevel(LogLevel.INFO);
                kettleConfig.setInProduction(true);
            }
            Kettle.initialize(kettleConfig, getReactApplicationContext());
            promise.resolve(true);
        }
    }
}
