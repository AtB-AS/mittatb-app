package no.entur.abt.android.bluetooth.format;

/**
 * Receiver listening for challenges broadcast from inspection clients.
 */
public interface ChallengeReceiver {
	/**
	 * Resume listening.
	 */
	void onResume();

	/**
	 * Pause listening.
	 */
	void onPause();

	void addChallengeListener(ChallengeListener challengeListener);

	void removeChallengeListener(ChallengeListener challengeListener);
}
