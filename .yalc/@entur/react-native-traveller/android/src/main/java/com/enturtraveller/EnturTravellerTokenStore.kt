package com.enturtraveller

import android.content.SharedPreferences
import no.entur.abt.android.token.ActivatedToken
import no.entur.abt.android.token.PendingToken
import no.entur.abt.android.token.TokenEncoder
import no.entur.abt.android.token.TokenStore
import no.entur.abt.android.token.keystore.TokenKeyStore
import java.security.Provider
import java.time.Clock

class EnturTravellerTokenStore(sharedPreferences: SharedPreferences?, keyStore: TokenKeyStore?,
                               tokenEncoder: TokenEncoder?, clock: Clock?, provider: Provider?
) : TokenStore<String>(
  sharedPreferences, keyStore, tokenEncoder, clock, provider
) {
  public override fun saveToken(token: ActivatedToken<String>?) {
    super.saveToken(token)
  }
}
