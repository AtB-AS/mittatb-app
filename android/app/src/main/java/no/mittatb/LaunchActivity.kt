package no.mittatb

import com.facebook.react.ReactActivity
import android.content.Intent
import android.os.Bundle

class LaunchActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val intent: Intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
