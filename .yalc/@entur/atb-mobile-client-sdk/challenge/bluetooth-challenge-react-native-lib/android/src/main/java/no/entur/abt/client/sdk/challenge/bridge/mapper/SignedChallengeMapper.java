package no.entur.abt.client.sdk.challenge.bridge.mapper;

import com.facebook.react.bridge.WritableNativeMap;

import java.time.Duration;
import java.time.Instant;

import no.entur.abt.android.bluetooth.format.Challenge;
import no.entur.abt.android.bluetooth.format.SignedChallenge;

public class SignedChallengeMapper extends AbstractMapper<SignedChallenge> {

    protected static final String BYTES = "bytes";
    protected static final String DELAY = "delay";
    protected static final String SELF_INSPECT = "selfInspect";
    protected static final String NONCE = "nonce";
    protected static final String CLIENT_ID = "clientId";

    @Override
    protected void populateMap(SignedChallenge signedChallenge, WritableNativeMap map) {
        map.putString(BYTES, encode(signedChallenge.getBytes()));
        Challenge challenge = signedChallenge.getChallenge();

        map.putInt(DELAY, challenge.getClientId());
        map.putBoolean(SELF_INSPECT, challenge.isSelfInspect());
        map.putString(NONCE, encode(challenge.getNonce()));
        map.putInt(CLIENT_ID, challenge.getClientId());
    }
}


