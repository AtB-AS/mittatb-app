package no.mittatb

import android.content.pm.PackageManager
import android.text.TextUtils
import androidx.multidex.MultiDexApplication
import com.bugsnag.android.Bugsnag
import com.bugsnag.android.Configuration
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.intercom.reactnative.IntercomModule

class MainApplication : MultiDexApplication(), ReactApplication {
    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // add(MyReactNativePackage())
                    add(KettleSDKPackage())
                }
        )
    }

    override fun onCreate() {
        super.onCreate()
        tryInitializeBugsnag()
        tryInitializeIntercom()
        loadReactNative(this)
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
