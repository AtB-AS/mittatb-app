package no.entur.abt.android.bluetooth.format;

import java.time.Duration;
import java.time.Instant;

// dummy challenge with an additional field
// when adding more real challenge versions, probably Challenge should be refactored to a more generic class.

public class DummyChallenge extends Challenge {

	private Instant validFromTime;

	protected DummyChallenge(int clientId, Duration delay, boolean selfInspect, byte[] nonce, Instant validFromTime, Instant validToTime, int transport) {
		super(clientId, delay, selfInspect, nonce, validToTime, transport);

		this.validFromTime = validFromTime;
	}

	public boolean isValid(Instant time) {
		if (!super.isValid(time) || time.isBefore(validFromTime)) {
			return false;
		}
		return true;
	}

}
