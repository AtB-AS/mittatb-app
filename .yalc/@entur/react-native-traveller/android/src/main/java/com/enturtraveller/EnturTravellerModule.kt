package com.enturtraveller

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import no.entur.abt.android.time.TempoRealtimeClock
import no.entur.abt.android.token.*
import no.entur.abt.android.token.attestation.DeviceAttestator
import no.entur.abt.android.token.attestation.DeviceAttestorBuilder
import no.entur.abt.android.token.device.DefaultDeviceDetailsProvider
import no.entur.abt.android.token.device.DeviceDetailsProvider
import no.entur.abt.android.token.keystore.DefaultTokenKeyStore
import no.entur.abt.android.token.keystore.TokenKeyStore
import no.entur.abt.android.token.keystore.TokenTrustChain
import no.entur.abt.core.exchange.grpc.traveller.v1.Attestation
import uk.org.netex.www.netex.TokenAction
import java.security.PrivateKey
import java.security.cert.CertificateFactory
import java.time.Instant
import java.util.*
import java.util.concurrent.locks.ReentrantLock


class EnturTravellerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var tokenStore: TokenStore<String>? = null
  private var tokenKeyStore: TokenKeyStore<String>? = null
  private var deviceAttestor: DeviceAttestator? = null
  private var deviceDetailsProvider: DeviceDetailsProvider? = null
  private var clock: TempoRealtimeClock? = null
  private var encoder: TokenEncoder? = null
  private var tokenPropertyStore: TokenPropertyStore? = null
  private var sharedPreferences: SharedPreferences? = null
  private var started: Boolean = false

  @ReactMethod
  fun start(googleApiKey: String, promise: Promise) {
    if (!started) {
      started = true

      var applicationContext: Context = reactApplicationContext.applicationContext
      var application: Application = applicationContext as Application
      tokenKeyStore = DefaultTokenKeyStore.newBuilder<String>().build()
      deviceDetailsProvider = DefaultDeviceDetailsProvider
        .newBuilder(application)
        .withApplicationDeviceInfoElement(applicationContext.packageName, BuildConfig.VERSION_NAME, "${BuildConfig.VERSION_CODE}")
        .withOsDeviceInfoElement()
        .withNetworkDeviceStatus()
        .withBluetoohDeviceStatus()
        .withNfcDeviceStatus()
        .build()
      clock = TempoRealtimeClock.newBuilder(application).withSlackSntpTimeSource().build()
      encoder = TokenEncoder(clock, deviceDetailsProvider)
      deviceAttestor = DeviceAttestorBuilder.newBuilder()
        .withApiKey(googleApiKey)
        .withContext(applicationContext)
        .withDeviceDetailsProvider(deviceDetailsProvider)
        .withEmulator(false)
        .withAttestationTimeout(1000000)
        .build()
      sharedPreferences = applicationContext.getSharedPreferences(this.name, Context.MODE_PRIVATE)
      tokenPropertyStore = DefaultTokenPropertyStore(sharedPreferences, ReentrantLock(), 5000)
      tokenStore = TokenStore(tokenKeyStore, encoder, clock, null, tokenPropertyStore)

    }
    promise.resolve(null)
  }

  @ReactMethod
  fun getToken(accountId: String, promise: Promise) {
    if (!started) {
      promise.reject(Throwable("The start-function must be called before any other native method"))
      return
    }
    try {
      val token = tokenStore!!.getToken(getTokenContext(accountId))

      if (token is ActivatedToken<*>) {
        val map = WritableNativeMap()
        map.putString("tokenId", token.tokenId)
        map.putString("tokenValidityStart", token.validityStart.toString())
        map.putString("tokenValidityEnd", token.validityEnd.toString())
        promise.resolve(map)
      } else {
        Log.d("TOKEN ERROR", "No activated token available: $token")
        promise.resolve(null)
      }
    } catch (err: Error) {
      print("inside catch")
      promise.reject("TOKEN ERROR", err.localizedMessage)
    }
  }

  @ReactMethod
  fun getSecureToken(accountId: String, actions: ReadableArray, promise: Promise) {
    if (!started) {
      promise.reject(Throwable("The start-function must be called before any other native method"))
      return
    }

    try {
      val tokenActions: MutableList<TokenAction> = mutableListOf<TokenAction>()
      val size = actions.size()
      for (i in 0 until size) {
        tokenActions.add(TokenAction.forNumber(actions.getInt(i)))
      }
      val token = tokenStore!!.getToken(getTokenContext(accountId))
      if (token != null) {
        val container = token.encodeAsSecureContainer(TokenEncodingRequest(Collections.emptyList(), tokenActions.toTypedArray()))
        if (container != null) {
          val encoded = Base64.encodeToString(container.toByteArray(), Base64.NO_WRAP)
          Log.d("ENCODED", encoded)
          promise.resolve(encoded)
        } else {
          throw Throwable("Container is null")
        }
      } else {
        throw Throwable("Token is null")
      }
    } catch (err: Error) {
      Log.d("GET_SECURE_TOKEN_ERROR", err.localizedMessage)
      promise.reject("GET_SECURE_TOKEN_ERROR", err)
    }
  }

  @ReactMethod
  fun addToken(accountId: String, tokenId: String, certificate: String, tokenValidityStart: Double, tokenValidityEnd: Double, promise: Promise) {
    if (!started) {
      promise.reject(Throwable("The start-function must be called before any other native method"))
      return
    }

    try {
      var tokenContext = getTokenContext(accountId)
      val signatureKey: PrivateKey = tokenKeyStore!!.getSignaturePrivateKey(tokenContext, tokenId)
      val encryptionKey: PrivateKey = tokenKeyStore!!.getEncryptionPrivateKey(tokenContext, tokenId)
      val command: ByteArray = byteArrayOf()
      val token = tokenStore!!.createPendingNewToken(tokenContext, tokenId, signatureKey, encryptionKey, encoder, command)
      val certFactory = CertificateFactory.getInstance("X.509")


      val activatedToken: ActivatedToken<String> = tokenStore!!.convertPendingTokenToActiveToken(token, Base64.decode(certificate, Base64.NO_WRAP), Instant.ofEpochMilli(tokenValidityStart.toLong()), Instant.ofEpochMilli(tokenValidityEnd.toLong()))
      Log.d("ActivatedToken", activatedToken.tokenId)
      promise.resolve(activatedToken != null)
    } catch (err: Error) {
      promise.reject("ADD_TOKEN_ERROR", err.localizedMessage)
    }
  }

  @ReactMethod
  fun deleteToken(accountId: String, promise: Promise) {
    if (!started) {
      promise.reject(Throwable("The start-function must be called before any other native method"))
      return
    }

    try {
      tokenStore!!.clearToken(getTokenContext(accountId))
      promise.resolve(null)
    } catch (err: Error) {
      promise.reject("TOKEN ERROR", err.localizedMessage)
    }
  }

  @ReactMethod
  fun attestLegacy(accountId: String, tokenId: String, nonce: String, serverPublicKey: String, promise: Promise) {
    promise.reject("ATTESTATION_ERROR", "Legacy attestation is only for iOS devices running anything lower then iOS 14")
  }

  @ReactMethod
  fun attest(accountId: String, tokenId: String, nonce: String, promise: Promise) {
    if (!started) {
      promise.reject(Throwable("The start-function must be called before any other native method"))
      return
    }

    try {
      if (!deviceAttestor!!.supportsAttestation()) {
        throw Throwable("Device does not support Attestation")
      }
      var tokenContext = getTokenContext(accountId)
      val base64Nonce = Base64.decode(nonce, Base64.DEFAULT)
      val signatureChain: TokenTrustChain = tokenKeyStore!!.createSignatureKey(tokenContext, tokenId, base64Nonce)
      val encryptionChain: TokenTrustChain = tokenKeyStore!!.createEncryptionKey(tokenContext, tokenId, base64Nonce)
      val attestation: Attestation = deviceAttestor!!.attest(base64Nonce, signatureChain.publicEncoded, encryptionChain.publicEncoded)
      val obj = WritableNativeMap()

      val encodedSignatureChain = Arguments.createArray()
      signatureChain.certificateChain.forEach { encodedSignatureChain.pushString(Base64.encodeToString(it, Base64.NO_WRAP)) }

      val encodedEncryptionChain = Arguments.createArray()
      encryptionChain.certificateChain.forEach { encodedEncryptionChain.pushString(Base64.encodeToString(it, Base64.NO_WRAP)) }

      obj.putString("signaturePublicKey", Base64.encodeToString(signatureChain.keyPair.public.encoded, Base64.NO_WRAP))
      obj.putString("encryptionPublicKey", Base64.encodeToString(encryptionChain.keyPair.public.encoded, Base64.NO_WRAP))

      obj.putArray("signatureChain", encodedSignatureChain)
      obj.putArray("encryptionChain", encodedEncryptionChain)

      obj.putString("attestationObject", attestation.androidSafetynet.jwsResult)
      promise.resolve(obj)
    } catch (err: Error) {
      Log.d("ATTESTATION_ERROR","Error with attest")
      Log.d("ATTESTATION_ERROR", err.localizedMessage)
      promise.reject("ATTESTATION_ERROR", err)
    }
  }

  override fun getName(): String {
    return "EnturTraveller"
  }

  fun getTokenContext(accountId: String): TokenContext<String> {
    return EnturTravellerTokenContext(accountId)
  }
}
