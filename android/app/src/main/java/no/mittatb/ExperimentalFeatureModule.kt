package no.mittatb

import android.content.pm.PackageManager
import com.facebook.react.bridge.ReactApplicationContext

class ExperimentalFeatureModule(
    private val reactContext: ReactApplicationContext
) : NativeExperimentalFeatureSpec(reactContext) {
    private val releaseStage: String
    // Only allow experimental features in non-store channels on Android
    private var experimentalReleaseStages: Array<String> = arrayOf("dev", "staging")

    init {
        val ai = reactContext.packageManager.getApplicationInfo(
            reactContext.packageName,
            PackageManager.GET_META_DATA
        )
        releaseStage = ai.metaData?.getString("no.mittatb.releaseStage") ?: "unknown"
    }

    override fun getName() = NAME

    override fun isExperimentalEnabled(): Boolean {
        return experimentalReleaseStages.contains(releaseStage)
    }

    companion object {
        const val NAME = "ExperimentalFeature"
    }
}