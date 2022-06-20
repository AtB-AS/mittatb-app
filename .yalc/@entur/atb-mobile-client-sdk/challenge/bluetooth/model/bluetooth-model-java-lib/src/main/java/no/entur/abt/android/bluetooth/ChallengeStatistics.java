package no.entur.abt.android.bluetooth;

import java.time.Clock;
import java.time.Instant;

/**
 * Statistics for challenges, and parts of challenges (frames) received from a single broadcasting clientId.
 */
public class ChallengeStatistics<T> {

	private Integer clientId;
	private int numChallengesReceived;
	private int numChallengeFramesReceived;
	private int avgSignalStrength;
	private int latestSignalStrength;

	private Instant firstReceived;

	private Instant lastReceived;

	private Instant lastNonceReceived;

	private T latestChallenge;

	private ChallengeAdvertisingFrame latestFrame;

	private Clock clock;

	public ChallengeStatistics(Integer clientId, Clock clock) {
		this.clientId = clientId;
		this.clock = clock;
		this.firstReceived = this.clock.instant();
	}

	protected void registerFrameReceived(ChallengeAdvertisingFrame frame, int signalStrength) {
		latestFrame = frame;
		latestSignalStrength = signalStrength;

		avgSignalStrength = (avgSignalStrength * numChallengeFramesReceived + signalStrength) / (numChallengeFramesReceived + 1);
		numChallengeFramesReceived++;
		lastReceived = clock.instant();
	}

	public void registerNonceReceived(T challenge) {
		this.latestChallenge = challenge;
		numChallengesReceived++;
		lastNonceReceived = clock.instant();
	}

	public int getNumChallengesReceived() {
		return numChallengesReceived;
	}

	public Integer getClientId() {
		return clientId;
	}

	public int getNumChallengeFramesReceived() {
		return numChallengeFramesReceived;
	}

	public int getAvgSignalStrength() {
		return avgSignalStrength;
	}

	public int getLatestSignalStrength() {
		return latestSignalStrength;
	}

	public Instant getFirstReceived() {
		return firstReceived;
	}

	public T getLatestChallenge() {
		return latestChallenge;
	}

	public ChallengeAdvertisingFrame getLatestFrame() {
		return latestFrame;
	}

	public Instant getLastReceived() {
		return lastReceived;
	}

	public Instant getLastNonceReceived() {
		return lastNonceReceived;
	}
}
