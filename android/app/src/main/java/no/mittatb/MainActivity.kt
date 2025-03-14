package no.mittatb

import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity(), NfcAdapter.ReaderCallback {

  private var nfcAdapter: NfcAdapter? = null

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "atb"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    nfcAdapter = NfcAdapter.getDefaultAdapter(this)
  }

  override fun onResume() {
    super.onResume()

    // Use to suppress NFC reading from other app when our app is active
    // This will request all NFC Tag types to be sent to this Activity
    // With Platform sounds off, so it's silent
    nfcAdapter?.enableReaderMode(
      this,
      this,
      NfcAdapter.FLAG_READER_NFC_A or
              NfcAdapter.FLAG_READER_NFC_B or
              NfcAdapter.FLAG_READER_NFC_F or
              NfcAdapter.FLAG_READER_NFC_V or
              NfcAdapter.FLAG_READER_NFC_BARCODE or
              NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK or
              NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS,
      null
    )
  }

  override fun onPause() {
    super.onPause()

    // When the app is in background, allow other app to read NFC tags (if any)
    nfcAdapter?.disableReaderMode(this)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate = DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onTagDiscovered(tag: Tag?) {
    // Do nothing when NFC tag is discovered
  }
}
