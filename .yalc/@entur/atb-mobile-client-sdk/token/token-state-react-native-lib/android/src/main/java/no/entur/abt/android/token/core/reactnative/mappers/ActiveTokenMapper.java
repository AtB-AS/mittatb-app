package no.entur.abt.android.token.core.reactnative.mappers;

import com.facebook.react.bridge.WritableNativeMap;

import java.time.Instant;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.PendingToken;
import no.entur.abt.android.token.Token;

public class ActiveTokenMapper<T> extends AbstractTokenMapper<T, ActivatedToken<T>> {

    protected static final String RENEW_TOKEN = "renewToken";

    protected static final String TOKEN_VALIDITY_START = "validityStart";
    protected static final String TOKEN_VALIDITY_END = "validityEnd";

    protected final AbstractPendingTokenMapper<T> pendingTokenMapper;

    public ActiveTokenMapper(AbstractPendingTokenMapper<T> pendingTokenMapper) {
        this.pendingTokenMapper = pendingTokenMapper;
    }

    @Override
    protected void populateMap(ActivatedToken<T> token, WritableNativeMap map) {
        super.populateMap(token, map);

        Instant validityStart = token.getValidityStart();
        if(validityStart != null) {
            map.putDouble(TOKEN_VALIDITY_START, validityStart.toEpochMilli() / 1000);
        }
        Instant validityEnd = token.getValidityEnd();
        if(validityEnd != null) {
            map.putDouble(TOKEN_VALIDITY_END, validityEnd.toEpochMilli() / 1000);
        }

        Token<T> renewToken = token.getRenewToken();
        if(renewToken != null) {
            map.putMap(RENEW_TOKEN, pendingTokenMapper.map((PendingToken<T>) renewToken));
        }

    }
}


