package no.entur.abt.android.common.bluetooth;

import android.os.Handler;
import android.util.Log;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import no.entur.abt.android.bluetooth.format.Challenge;
import no.entur.abt.android.bluetooth.format.ChallengeBinarySerializer;
import no.entur.abt.android.bluetooth.format.ChallengeListener;
import no.entur.abt.android.bluetooth.format.ChallengeReceiver;
import no.entur.abt.android.bluetooth.format.SignedChallenge;
import no.entur.abt.android.bluetooth.format.v1.ChallengeBinaryFormat;

public class EmulatorChallengeReceiver implements ChallengeReceiver {

	private static final String TAG = EmulatorChallengeReceiver.class.getName();
	private Handler handler;
	private final Clock clock;
	private Set<ChallengeListener> challengeListeners = new HashSet<>();

	public EmulatorChallengeReceiver(Clock clock, Handler handler) {
		this.clock = clock;
		this.handler = handler;
	}

	@Override
	public void onResume() {
		handler.post(nonceCreatingRunnable);
	}

	private Runnable nonceCreatingRunnable = new Runnable() {

		private int nonceCount = 0;

		@Override
		public void run() {
			ChallengeBinarySerializer serializer = new ChallengeBinaryFormat();
			try {
				if (nonceCount > 9998) {
					nonceCount = 0;
				}

				++nonceCount;
				String nonce = "FAKE" + Integer.toString(nonceCount);

				Instant now = clock.instant();
				Challenge n = Challenge.newBuilder()
						.withClientId((short) 11111)
						.withDelay(Duration.ZERO)
						.withValidToTime(now.plusSeconds(50))
						.withNonce(nonce.getBytes(StandardCharsets.ISO_8859_1))
						.build();
				for (ChallengeListener challengeListener : challengeListeners) {
					challengeListener.onChallengeReceived(Arrays.asList(new SignedChallenge(serializer.serialize(n), n, 0)));
				}
			} catch (Exception e) {
				Log.w(TAG, "Unexpected problem", e);
			}
			handler.postDelayed(this, 10_000);

		}
	};

	@Override
	public void onPause() {
		handler.removeCallbacks(nonceCreatingRunnable);
	}

	@Override
	public void addChallengeListener(ChallengeListener challengeListener) {
		challengeListeners.add(challengeListener);
	}

	@Override
	public void removeChallengeListener(ChallengeListener challengeListener) {
		challengeListeners.remove(challengeListener);
	}
}
