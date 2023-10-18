package no.mittatb;

import android.content.Context;

import com.kogenta.kettle.common.config.KettleConfig;
import com.kogenta.kettle.common.logging.LogLevel;
import com.kogenta.kettle.sdk.Kettle;

public class BeaconsApplication extends MainApplication {
    @Override
    public void addExtraConfigurations(Context context) {
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
            Kettle.initialize(kettleConfig, context);
        }
    }
}
