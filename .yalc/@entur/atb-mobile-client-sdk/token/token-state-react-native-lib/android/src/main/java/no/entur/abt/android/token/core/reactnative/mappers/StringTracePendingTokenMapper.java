package no.entur.abt.android.token.core.reactnative.mappers;

import com.facebook.react.bridge.WritableNativeMap;

import no.entur.abt.android.token.PendingToken;
import no.entur.abt.android.token.TraceMapper;

// convenience class for trace uuid

public class StringTracePendingTokenMapper extends AbstractPendingTokenMapper<String> {

    @Override
    protected void populateMap(PendingToken<String> token, WritableNativeMap map) {
        super.populateMap(token, map);

        map.putString(COMMAND_TRACE, token.getCommandTrace());
    }

}
