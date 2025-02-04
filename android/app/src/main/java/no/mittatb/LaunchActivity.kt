package no.mittatb

import com.facebook.react.ReactActivity
import android.content.Intent
import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash

class LaunchActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this, R.style.AppTheme);
        super.onCreate(savedInstanceState)
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
