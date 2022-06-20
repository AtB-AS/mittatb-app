package no.entur.abt.android.token.core.reactnative.mappers;

import android.util.Base64;

import com.facebook.react.bridge.WritableNativeMap;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

public abstract class AbstractMapper<R> {

    public WritableNativeMap map(R r) {
        WritableNativeMap map = new WritableNativeMap();

        populateMap(r, map);

        return map;
    }

    protected abstract void populateMap(R token, WritableNativeMap map);

    public static String encode(byte[] content) {
        return Base64.encodeToString(content, Base64.NO_WRAP);
    }
}
