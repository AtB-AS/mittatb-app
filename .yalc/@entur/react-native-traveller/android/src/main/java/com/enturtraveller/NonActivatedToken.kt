package com.enturtraveller

import no.entur.abt.android.token.Token
import no.entur.abt.android.token.TokenContext
import no.entur.abt.android.token.TokenEncoder
import java.security.KeyPair

class NonActivatedToken(tokenId: String?, signatureKeyPair: KeyPair, encryptKeyPair: KeyPair, tokenEncoder: TokenEncoder?, strainNumber: Int, tokenContext: TokenContext<String>?) : Token<String>(tokenId, signatureKeyPair, encryptKeyPair, tokenEncoder, strainNumber, tokenContext) {
}
