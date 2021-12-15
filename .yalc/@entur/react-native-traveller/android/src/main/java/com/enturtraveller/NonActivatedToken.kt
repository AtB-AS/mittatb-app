package com.enturtraveller

import no.entur.abt.android.token.Token
import no.entur.abt.android.token.TokenContext
import no.entur.abt.android.token.TokenEncoder
import java.security.PrivateKey

class NonActivatedToken(tokenId: String?, signatureKey: PrivateKey?, encryptKey: PrivateKey?, tokenEncoder: TokenEncoder?, strainNumber: Int, tokenContext: TokenContext<String>?) : Token<String>(tokenId, signatureKey, encryptKey, tokenEncoder, strainNumber, tokenContext) {
}
