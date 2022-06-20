package no.entur.abt.android.token.core.reactnative.mappers;

// https://reactnative.dev/docs/native-modules-android#argument-types

import android.util.Base64;

import com.facebook.react.bridge.WritableNativeMap;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.Token;

public class AbstractTokenMapper<T, R extends Token<T>> extends AbstractMapper<R> {

    protected static final String ACTIVATED = "activated";

    protected static final String TOKEN_ID = "tokenId";
    protected static final String TOKEN_CONTEXT_ID = "tokenContextId";
    protected static final String DEVICE_ATTESTATION_COUNTER = "deviceAttestationCounter";


    protected void populateMap(R token, WritableNativeMap map) {
        map.putBoolean(ACTIVATED, token instanceof ActivatedToken);
        map.putString(TOKEN_ID, token.getTokenId());
        map.putString(TOKEN_CONTEXT_ID, token.getTokenContext().getId());
        map.putInt(DEVICE_ATTESTATION_COUNTER, token.getDeviceAttestationCount());
    }

}
