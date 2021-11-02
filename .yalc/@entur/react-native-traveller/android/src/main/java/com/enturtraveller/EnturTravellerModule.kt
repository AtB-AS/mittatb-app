package com.enturtraveller

import android.app.Application
import android.content.Context
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import no.entur.abt.android.time.TempoRealtimeClock
import no.entur.abt.android.token.ActivatedToken
import no.entur.abt.android.token.TokenEncoder
import no.entur.abt.android.token.TokenEncodingRequest
import no.entur.abt.android.token.attestation.DeviceAttestator
import no.entur.abt.android.token.attestation.DeviceAttestorBuilder
import no.entur.abt.android.token.device.DefaultDeviceDetailsProvider
import no.entur.abt.android.token.device.DeviceDetailsProvider
import no.entur.abt.android.token.keystore.DefaultTokenKeyStore
import no.entur.abt.android.token.keystore.TokenKeyStore
import no.entur.abt.android.token.keystore.TokenTrustChain
import no.entur.abt.core.exchange.grpc.traveller.v1.Attestation
import uk.org.netex.www.netex.TokenAction
import java.io.ByteArrayInputStream
import java.security.PrivateKey
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import java.time.Instant
import java.util.*


class EnturTravellerModule(reactContext: ReactApplicationContext, apiKey: String) : ReactContextBaseJavaModule(reactContext) {
  private var tokenStore: EnturTravellerTokenStore
  private var tokenKeyStore: TokenKeyStore = DefaultTokenKeyStore.newBuilder().build()
  private var deviceAttestor: DeviceAttestator
  private var deviceDetailsProvider: DeviceDetailsProvider
  private var clock: TempoRealtimeClock
  private var encoder: TokenEncoder

  init {
    var applicationContext: Context = reactApplicationContext.applicationContext
    var application: Application = applicationContext as Application
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
      .withApiKey(apiKey)
      .withContext(applicationContext)
      .withDeviceDetailsProvider(deviceDetailsProvider)
      .withEmulator(false)
      .withAttestationTimeout(1000000)
      .build()
    tokenStore = EnturTravellerTokenStore(reactContext.getSharedPreferences(this.name, Context.MODE_PRIVATE), tokenKeyStore, encoder, clock, null)
  }
  override fun getName(): String {
      return "EnturTraveller"
  }

  @ReactMethod
  fun getToken(promise: Promise) {
    try {
      val token = tokenStore.token

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
  fun getSecureToken(actions: ReadableArray, promise: Promise) {
    try {
      val tokenActions: Array<TokenAction> = arrayOf()

      actions.toArrayList().forEach {
        val value = it as Double
        Log.d("ACTIONS", TokenAction.forNumber(value.toInt()).toString())
        tokenActions.plus(TokenAction.forNumber(value.toInt()))
      }
      val token = tokenStore.token
      if (token != null) {
        val container = token.encodeAsSecureContainer(TokenEncodingRequest(Collections.emptyList(), tokenActions))
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
  fun addToken(tokenId: String, certificate: String, tokenValidityStart: Double, tokenValidityEnd: Double, promise: Promise) {
    try {
      val signatureKey: PrivateKey = tokenKeyStore.getSignaturePrivateKey(tokenId)
      val encryptionKey: PrivateKey = tokenKeyStore.getEncryptionPrivateKey(tokenId)
      val command: ByteArray = byteArrayOf()
      val token = tokenStore.createPendingNewToken(tokenId, signatureKey, encryptionKey, encoder, command)
      val certFactory = CertificateFactory.getInstance("X.509")


      val activatedToken: ActivatedToken<String> = tokenStore.convertPendingTokenToActiveToken(token, Base64.decode(certificate, Base64.NO_WRAP), Instant.ofEpochMilli(tokenValidityStart.toLong()), Instant.ofEpochMilli(tokenValidityEnd.toLong()))
      Log.d("ActivatedToken", activatedToken.tokenId)
      promise.resolve(activatedToken != null)
    } catch (err: Error) {
      promise.reject("ADD_TOKEN_ERROR", err.localizedMessage)
    }
  }

  @ReactMethod
  fun deleteToken(promise: Promise) {
    try {
      val tokenId = tokenStore.token.tokenId
      tokenKeyStore.removeToken(tokenId)
      Log.d("DELETED_TOKEN", tokenId)
      promise.resolve("Deleted $tokenId")
    } catch (err: Error) {
      promise.reject("TOKEN ERROR", err.localizedMessage)
    }
  }

  @ReactMethod
  fun attestLegacy(tokenId: String, nonce: String, serverPublicKey: String, promise: Promise) {
    promise.reject("ATTESTATION_ERROR", "Legacy attestation is only for iOS devices running anything lower then iOS 14")
  }

  @ReactMethod
  fun attest(tokenId: String, nonce: String, promise: Promise) {
    try {
      if (!deviceAttestor.supportsAttestation()) {
        throw Throwable("Device does not support Attestation")
      }

      val base64Nonce = Base64.decode(nonce, Base64.DEFAULT)
      val signatureChain: TokenTrustChain = tokenKeyStore.createSignatureKey(tokenId, base64Nonce)
      val encryptionChain: TokenTrustChain = tokenKeyStore.createEncryptionKey(tokenId, base64Nonce)
      val attestation: Attestation = deviceAttestor.attest(base64Nonce, signatureChain.publicEncoded, encryptionChain.publicEncoded)
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

}
