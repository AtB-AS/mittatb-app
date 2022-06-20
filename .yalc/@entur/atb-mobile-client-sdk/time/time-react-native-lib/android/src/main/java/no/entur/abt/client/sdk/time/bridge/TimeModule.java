// TimeModule.java

package no.entur.abt.client.sdk.time.bridge;

import android.app.Application;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import no.entur.abt.android.time.RealtimeClock;
import no.entur.abt.android.time.TempoRealtimeClock;

public class TimeModule extends ReactContextBaseJavaModule {

    private final static String TAG = TimeModule.class.getName();

    private final ReactApplicationContext reactContext;

    private RealtimeClock clock;

    public TimeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        clock = createClock();
    }

    protected TempoRealtimeClock createClock() {
        Log.d(TAG, "Init time provider");
        Application application = (Application) getReactApplicationContext().getApplicationContext();

        return TempoRealtimeClock.newBuilder(application)
                .withSlackSntpTimeSource()
                // .withAndroidWorkManagerSchedulerMinutes(60)
                .withAutostart(true)
                .build();
    }


    @Override
    public String getName() {
        return "Time";
    }

    @ReactMethod
    public void currentTimeMillis(Promise promise) {
        promise.resolve(clock.millis());
    }

    @ReactMethod
    public void setEnabled(boolean enabled, Promise promise) {
        clock.setEnabled(enabled);
        promise.resolve(null);
    }

    @ReactMethod
    public void isEnabled(Promise promise) {
        promise.resolve(clock.isEnabled());
    }

}
