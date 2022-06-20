package no.entur.abt.android.bluetooth.header;

import java.util.Comparator;
import java.util.Objects;

public class ChallengeAdvertisingFrameHeader extends ChallengeAdvertisingFrameGroupHeader {

	public static final Comparator<ChallengeAdvertisingFrameHeader> comparator = (a, b) -> {
		int result = Integer.compare(a.getChannel(), b.getChannel());
		if (result != 0) {
			return result;
		}
		result = Integer.compare(a.getClientId(), b.getClientId());
		if (result != 0) {
			return result;
		}
		result = Integer.compare(a.getCorrelationId(), b.getCorrelationId());
		if (result != 0) {
			return result;
		}
		return Integer.compare(a.getFrameNumber(), b.getFrameNumber());
	};

	private final int frameNumber; // 0-based index
	private final boolean lastFrame;

	public ChallengeAdvertisingFrameHeader(int clientId, int frameNumber, boolean lastFrame, int correlationId, int channel) {
		super(clientId, correlationId, channel, Objects.hash(clientId, correlationId, channel, frameNumber, lastFrame));

		this.frameNumber = frameNumber;
		this.lastFrame = lastFrame;
	}

	// i.e. frame index
	public int getFrameNumber() {
		return frameNumber;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		ChallengeAdvertisingFrameHeader that = (ChallengeAdvertisingFrameHeader) o;
		return clientId == that.clientId && correlationId == that.correlationId && frameNumber == that.frameNumber && channel == that.channel
				&& lastFrame == that.lastFrame;
	}

	@Override
	public int hashCode() {
		return hash;
	}

	public boolean isLast() {
		return lastFrame;
	}

}
