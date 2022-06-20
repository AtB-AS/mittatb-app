package no.entur.abt.android.bluetooth.format;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class ChallengeFilter {

	public static final int NONCE_TIME_TO_LIVE = 10_000; // milliseconds

	private static class ChallengeWrapper {
		SignedChallenge challenge;
		Instant ttl;

		public ChallengeWrapper(SignedChallenge challenge, Instant ttl) {
			this.challenge = challenge;
			this.ttl = ttl;
		}
	}

	private final Clock clock;

	private Map<Integer, ChallengeWrapper> receivedNonces = new ConcurrentHashMap<>();

	public ChallengeFilter(Clock clock) {
		this.clock = clock;
	}

	public Set<SignedChallenge> add(SignedChallenge n) {
		Challenge challenge = n.getChallenge();
		int clientId = challenge.getClientId();
		ChallengeWrapper currentForClient = receivedNonces.get(clientId);
		if (currentForClient == null || !Objects.equals(n.getChallenge(), currentForClient.challenge.getChallenge())) {
			Instant validToTime = n.getChallenge().getValidToTime();
			Instant soon = clock.instant().plusMillis(NONCE_TIME_TO_LIVE);

			Instant deadline = soon.isBefore(validToTime) ? soon : validToTime;

			receivedNonces.put(challenge.getClientId(), new ChallengeWrapper(n, deadline));
		}
		return getValidNonces(clock.instant());
	}

	private Set<SignedChallenge> getValidNonces(Instant now) {
		return receivedNonces.values().stream().filter(e -> e.ttl.isAfter(now)).map(y -> y.challenge).collect(Collectors.toSet());
	}

	public void clear() {
		receivedNonces.clear();
	}
}
