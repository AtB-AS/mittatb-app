package no.mittatb

import android.content.pm.PackageManager
import android.text.TextUtils
import androidx.multidex.MultiDexApplication
import com.bugsnag.android.Bugsnag
import com.bugsnag.android.Configuration
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.intercom.reactnative.IntercomModule

class MainApplication : MultiDexApplication(), ReactApplication {
    override val reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages: MutableList<ReactPackage> = PackageList(this).packages
            // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(KettleSDKPackage())
            return packages
        }

        override fun getJSMainModuleName(): String = "index"

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        tryInitializeBugsnag()
        tryInitializeIntercom()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }
    }

    private fun tryInitializeBugsnag() {
        try {
            val ai = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
            val bundle = ai.metaData
            val bugsnagKey = bundle.getString("com.bugsnag.android.API_KEY")
            if (!TextUtils.isEmpty(bugsnagKey)) {
                val config = Configuration(bugsnagKey!!)
                val bugsnagReleaseStage = bundle.getString("com.bugsnag.android.RELEASE_STAGE")
                if (!TextUtils.isEmpty(bugsnagReleaseStage)) {
                    config.releaseStage = bugsnagReleaseStage
                }
                Bugsnag.start(this, config)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun tryInitializeIntercom() {
        try {
            val intercomApiKey = getString(R.string.IntercomApiKey)
            val intercomAppId = getString(R.string.IntercomAppId)
            if (!TextUtils.isEmpty(intercomApiKey) && !TextUtils.isEmpty(intercomAppId)) {
                IntercomModule.initialize(this, intercomApiKey, intercomAppId)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
