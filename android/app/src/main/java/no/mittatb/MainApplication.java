package no.mittatb;

import androidx.multidex.MultiDexApplication;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.text.TextUtils;

import com.bugsnag.android.Bugsnag;
import com.bugsnag.android.Configuration;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

import io.intercom.android.sdk.Intercom;

import com.kogenta.kettle.common.config.KettleConfig;
import com.kogenta.kettle.common.logging.LogLevel;
import com.kogenta.kettle.sdk.Kettle;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    tryInitializeBugsnag();
    tryInitializeIntercom();
    SoLoader.init(this, /* native exopackage */ false);

    addExtraConfigurations(getApplicationContext());

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  public void addExtraConfigurations(Context context) {}

  private void tryInitializeBugsnag() {
    try {
      ApplicationInfo ai = getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
      Bundle bundle = ai.metaData;
      String bugsnagKey = bundle.getString("com.bugsnag.android.API_KEY");
      if (!TextUtils.isEmpty(bugsnagKey)) {
          Configuration config = new Configuration(bugsnagKey);
          String bugsnagReleaseStage = bundle.getString("com.bugsnag.android.RELEASE_STAGE");
          if (!TextUtils.isEmpty(bugsnagKey)) {
              config.setReleaseStage(bugsnagReleaseStage);
          }
          Bugsnag.start(this, config);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void tryInitializeIntercom() {
    try {
        String intercomApiKey = getString(R.string.IntercomApiKey);
        String intercomAppId = getString(R.string.IntercomAppId);
        if (!TextUtils.isEmpty(intercomApiKey) && !TextUtils.isEmpty(intercomAppId)) {
            Intercom.initialize(this, intercomApiKey, intercomAppId);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
  }
}
