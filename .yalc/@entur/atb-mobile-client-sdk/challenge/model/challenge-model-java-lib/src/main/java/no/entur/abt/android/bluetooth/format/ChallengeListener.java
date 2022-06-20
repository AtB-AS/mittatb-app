package no.entur.abt.android.bluetooth.format;

import java.util.Collection;

/**
 * Interface to be implemented by clients interested in challenges being received.
 */
public interface ChallengeListener {

	/**
	 * Callback for one or more challenges received.
	 * 
	 * @param challengesReceived list of challenges
	 */
	void onChallengeReceived(Collection<SignedChallenge> challengesReceived);

	/**
	 * Callback if challenge scanning failed.
	 *
	 * @param errorCode error code
	 */
	void onScanFailed(int errorCode);

	/**
	 * Callback if Bluetooth is disabled while scanning
	 */
	void onBluetoothDisasbled();
}
