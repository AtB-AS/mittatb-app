package no.entur.abt.android.bluetooth.header;

import java.util.Objects;

/**
 *
 * Header with the fields common to a frame group (from the same Challenge).
 *
 */

public class ChallengeAdvertisingFrameGroupHeader {

	protected final int clientId;
	protected final int correlationId;
	protected final int channel;
	protected final int hash;

	public ChallengeAdvertisingFrameGroupHeader(ChallengeAdvertisingFrameHeader h) {
		this(h.getClientId(), h.getCorrelationId(), h.getChannel());
	}

	public ChallengeAdvertisingFrameGroupHeader(int clientId, int correlationId, int channel) {
		this(clientId, correlationId, channel, Objects.hash(clientId, correlationId, channel));
	}

	public ChallengeAdvertisingFrameGroupHeader(int clientId, int correlationId, int channel, int hash) {
		this.clientId = clientId;
		this.correlationId = correlationId;
		this.channel = channel;
		this.hash = hash;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o instanceof ChallengeAdvertisingFrameGroupHeader) {
			ChallengeAdvertisingFrameGroupHeader frameKey = (ChallengeAdvertisingFrameGroupHeader) o;
			return clientId == frameKey.clientId && correlationId == frameKey.correlationId && channel == frameKey.channel;
		}
		return false;
	}

	@Override
	public int hashCode() {
		return hash;
	}

	@Override
	public String toString() {
		return "FrameKey{" + "clientId=" + clientId + ", correlationId=" + correlationId + ", channel=" + channel + '}';
	}

	public int getCorrelationId() {
		return correlationId;
	}

	public int getClientId() {
		return clientId;
	}

	public int getChannel() {
		return channel;
	}

}
