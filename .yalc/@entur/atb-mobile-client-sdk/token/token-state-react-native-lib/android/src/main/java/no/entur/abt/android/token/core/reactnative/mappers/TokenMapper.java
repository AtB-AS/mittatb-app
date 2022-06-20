package no.entur.abt.android.token.core.reactnative.mappers;

import com.facebook.react.bridge.WritableNativeMap;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.PendingToken;
import no.entur.abt.android.token.Token;

public class TokenMapper {

    private StringTracePendingTokenMapper pendingTokenMapper = new StringTracePendingTokenMapper();
    private ActiveTokenMapper<String> mapper = new ActiveTokenMapper<>(pendingTokenMapper);

    public WritableNativeMap mapToken(Token token) {
        if(token instanceof PendingToken) {
            return pendingTokenMapper.map((PendingToken<String>) token);
        }
        return mapper.map((ActivatedToken<String>)token);
    }
}
