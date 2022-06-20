package no.entur.abt.android.token;

import java.io.Closeable;
import java.time.Instant;
import java.util.Set;

/**
 *
 * Interface for storing token properties, typically in a {@linkplain android.content.SharedPreferences} object.
 *
 */

public interface TokenPropertyStore {

	interface Reader {
		String getTokenId();

		Instant getTokenValidityStart();

		Instant getTokenValidityEnd();

		String getPendingRenewalTokenId();

		byte[] getPendingRenewalTokenCommandAttestation();

		String getPendingRenewalTokenCommandAttestationType();

		String getPendingRenewalTokenCommandUuid();

		byte[] getPendingRenewalTokenCommandTrace();

		String getPendingNewTokenId();

		byte[] getPendingNewTokenCommandAttestation();

		String getPendingNewTokenCommandAttestationType();

		byte[] getPendingNewTokenCommandTrace();

		String getPendingNewTokenCommandUuid();
	}

	interface Editor extends Reader, Closeable {

		void commitOrThrowException() throws TokenPropertyStoreException;

		Editor setToken(String id, Instant start, Instant end);

		Editor removeToken();

		Editor setPendingRenewalToken(String id, String uuid, byte[] attestation, String attestationType, byte[] trace);

		Editor removePendingRenewalToken();

		Editor setPendingNewToken(String id, String uuid, byte[] attestation, String attestationType, byte[] trace);

		Editor removePendingNewToken();

		void close(); // overload to avoid catching exceptions
	}

	/**
	 *
	 * Get the current token ids (by parsing property keys).
	 *
	 * @return set of token context ids
	 */
	Set<String> getTokenContextIds();

	/**
	 * This editor must always be closed, so that synchronization locks are released. So always use a try-finally block.
	 */

	Editor getEditor(TokenContext tokenContext) throws TokenPropertyStoreException;

	Reader getReader(TokenContext tokenContext);

	void clearAll() throws TokenPropertyStoreException;

}
