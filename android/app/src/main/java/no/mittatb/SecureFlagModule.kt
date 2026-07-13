package no.mittatb

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil

class SecureFlagModule(
    private val reactContext: ReactApplicationContext
) : NativeSecureFlagSpec(reactContext) {

    // FLAG_SECURE applies to the entire window, but can be enabled and disabled
    // from several sources. This keeps track of the number of times secure flag
    // is enabled. We set FLAG_SECURE only when the first source enables it, and
    // clears it only when the last source disables it.
    private var secureFlagCount = 0

    override fun getName() = NAME

    override fun enableSecureFlag() {
        UiThreadUtil.runOnUiThread {
            secureFlagCount++
            // Set FLAG_SECURE if this is the first source to enable it
            if (secureFlagCount == 1) {
                reactContext.currentActivity?.window?.setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE,
                    WindowManager.LayoutParams.FLAG_SECURE
                )
            }
        }
    }

    override fun disableSecureFlag() {
        UiThreadUtil.runOnUiThread {
            if (secureFlagCount > 0) {
                secureFlagCount--
            }
            // Clear FLAG_SECURE if this is the last source to disable it
            if (secureFlagCount == 0) {
                reactContext.currentActivity?.window?.clearFlags(
                    WindowManager.LayoutParams.FLAG_SECURE
                )
            }
        }
    }

    companion object {
        const val NAME = "SecureFlag"
    }
}
