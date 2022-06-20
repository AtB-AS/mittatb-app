package no.entur.abt.android.token;

import android.content.SharedPreferences;
import android.util.Base64;

import java.io.Closeable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

/**
 * 
 * This implementation synchronizes writes using locks, to avoid data races between different token contexts. <br>
 * <br>
 * Read synchronization is not supported. External synchronization should be applied per token-context so that read/write races does not occur.
 * 
 */

public class DefaultTokenPropertyStore implements TokenPropertyStore {

	public class DefaultReader implements TokenPropertyStore.Reader {

		protected final TokenContext tokenContext;

		public DefaultReader(TokenContext tokenContext) {
			this.tokenContext = tokenContext;
		}

		public String getTokenId() {
			return DefaultTokenPropertyStore.this.getTokenId(tokenContext);
		}

		public Instant getTokenValidityStart() {
			return DefaultTokenPropertyStore.this.getTokenValidityStart(tokenContext);
		}

		public Instant getTokenValidityEnd() {
			return DefaultTokenPropertyStore.this.getTokenValidityEnd(tokenContext);
		}

		public String getPendingRenewalTokenId() {
			return DefaultTokenPropertyStore.this.getPendingRenewalTokenId(tokenContext);
		}

		public byte[] getPendingRenewalTokenCommandAttestation() {
			return DefaultTokenPropertyStore.this.getPendingRenewalTokenCommandAttestation(tokenContext);
		}

		public String getPendingRenewalTokenCommandAttestationType() {
			return DefaultTokenPropertyStore.this.getPendingRenewalTokenCommandAttestationType(tokenContext);
		}

		public String getPendingRenewalTokenCommandUuid() {
			return DefaultTokenPropertyStore.this.getPendingRenewalTokenCommandUuid(tokenContext);
		}

		public byte[] getPendingRenewalTokenCommandTrace() {
			return DefaultTokenPropertyStore.this.getPendingRenewalTokenCommandTrace(tokenContext);
		}

		public String getPendingNewTokenId() {
			return DefaultTokenPropertyStore.this.getPendingNewTokenId(tokenContext);
		}

		public byte[] getPendingNewTokenCommandAttestation() {
			return DefaultTokenPropertyStore.this.getPendingNewTokenCommandAttestation(tokenContext);
		}

		@Override
		public String getPendingNewTokenCommandAttestationType() {
			return DefaultTokenPropertyStore.this.getPendingNewTokenCommandAttestationType(tokenContext);
		}

		public byte[] getPendingNewTokenCommandTrace() {
			return DefaultTokenPropertyStore.this.getPendingNewTokenCommandTrace(tokenContext);
		}

		public String getPendingNewTokenCommandUuid() {
			return DefaultTokenPropertyStore.this.getPendingNewTokenCommandUuid(tokenContext);
		}

	}

	public class DefaultEditor extends DefaultReader implements TokenPropertyStore.Editor, Closeable {

		protected final SharedPreferences.Editor editor;

		public DefaultEditor(SharedPreferences.Editor editor, TokenContext tokenContext) {
			super(tokenContext);
			this.editor = editor;
		}

		@Override
		public void commitOrThrowException() {
			// From the codes:
			// Note that when two editors are modifying preferences at the same time, the last one to call commit wins.
			if (!editor.commit()) {
				// this should really not happen, since we're using locks
				throw new IllegalStateException("Problem committing preferences for " + tokenContext.getId());
			}
		}

		@Override
		public Editor setToken(String id, Instant start, Instant end) {
			setTokenId(id);
			setTokenValidityStart(start);
			setTokenValidityEnd(end);
			return this;
		}

		@Override
		public Editor setPendingRenewalToken(String id, String uuid, byte[] attestation, String attestationType, byte[] trace) {
			setPendingRenewalTokenId(id);
			setPendingRenewalTokenCommandUuid(uuid);
			setPendingRenewalTokenCommandAttestation(attestation);
			setPendingRenewalTokenCommandAttestationType(attestationType);
			setPendingRenewalTokenCommandTrace(trace);
			return this;
		}

		@Override
		public Editor setPendingNewToken(String id, String uuid, byte[] attestation, String attestationType, byte[] trace) {
			setPendingNewTokenId(id);
			setPendingNewTokenCommandUuid(uuid);
			setPendingNewTokenCommandAttestation(attestation);
			setPendingNewTokenCommandAttestationType(attestationType);
			setPendingNewTokenCommandTrace(trace);
			return this;
		}

		@Override
		public Editor removeToken() {
			removeTokenId();
			removeTokenValidityStart();
			removeTokenValidityEnd();
			return this;
		}

		@Override
		public Editor removePendingRenewalToken() {
			removePendingRenewalTokenId();
			removePendingRenewalTokenCommand();
			return this;
		}

		@Override
		public Editor removePendingNewToken() {
			removePendingNewTokenId();
			removePendingNewTokenCommand();
			return this;
		}

		public Editor setTokenId(String id) {
			String tokenIdKey = getTokenIdKey(tokenContext);
			editor.putString(tokenIdKey, id);
			return this;
		}

		public Editor setTokenValidityStart(Instant start) {
			editor.putLong(getTokenValidityStartKey(tokenContext), start.toEpochMilli());
			return this;
		}

		public Editor setTokenValidityEnd(Instant end) {
			editor.putLong(getTokenValidityEndKey(tokenContext), end.toEpochMilli());
			return this;
		}

		public Editor setPendingRenewalTokenId(String id) {
			editor.putString(getPendingRenewalTokenIdKey(tokenContext), id);
			return this;
		}

		public Editor setPendingRenewalTokenCommandAttestationType(String attestationType) {
			String key = getPendingRenewalTokenCommandAttestationTypeKey(tokenContext);
			editor.putString(key, attestationType);
			return this;
		}

		public Editor setPendingRenewalTokenCommandAttestation(byte[] attestation) {
			String key = getPendingRenewalTokenCommandAttestationKey(tokenContext);
			editor.putString(key, Base64.encodeToString(attestation, Base64.NO_WRAP));
			return this;
		}

		public Editor setPendingRenewalTokenCommandTrace(byte[] trace) {
			String key = getPendingRenewalTokenCommandTraceKey(tokenContext);
			editor.putString(key, Base64.encodeToString(trace, Base64.NO_WRAP));
			return this;
		}

		public Editor setPendingRenewalTokenCommandUuid(String uuid) {
			String key = getPendingRenewalTokenCommandUuidKey(tokenContext);
			editor.putString(key, uuid);
			return this;
		}

		public Editor setPendingNewTokenId(String id) {
			editor.putString(getPendingNewTokenIdKey(tokenContext), id);
			return this;
		}

		public Editor setPendingNewTokenCommandUuid(String uuid) {
			String key = getPendingNewTokenCommandUuidKey(tokenContext);
			editor.putString(key, uuid);
			return this;
		}

		public Editor setPendingNewTokenCommandAttestation(byte[] command) {
			String key = getPendingNewTokenCommandAttestationKey(tokenContext);
			editor.putString(key, Base64.encodeToString(command, Base64.NO_WRAP));
			return this;
		}

		public Editor setPendingNewTokenCommandAttestationType(String type) {
			String key = getPendingNewTokenCommandAttestationTypeKey(tokenContext);
			editor.putString(key, type);
			return this;
		}

		public Editor setPendingNewTokenCommandTrace(byte[] command) {
			String key = getPendingNewTokenCommandTraceKey(tokenContext);
			editor.putString(key, Base64.encodeToString(command, Base64.NO_WRAP));
			return this;
		}

		public Editor removeTokenId() {
			editor.remove(getTokenIdKey(tokenContext));
			return this;
		}

		public Editor removeTokenValidityStart() {
			editor.remove(getTokenValidityStartKey(tokenContext));
			return this;
		}

		public Editor removeTokenValidityEnd() {
			editor.remove(getTokenValidityEndKey(tokenContext));
			return this;
		}

		public Editor removePendingRenewalTokenId() {
			editor.remove(getPendingRenewalTokenIdKey(tokenContext));
			return this;
		}

		public Editor removePendingRenewalTokenCommand() {
			editor.remove(getPendingRenewalTokenCommandUuidKey(tokenContext));
			editor.remove(getPendingRenewalTokenCommandAttestationKey(tokenContext));
			editor.remove(getPendingRenewalTokenCommandAttestationTypeKey(tokenContext));
			editor.remove(getPendingRenewalTokenCommandTraceKey(tokenContext));
			return this;
		}

		public Editor removePendingNewTokenId() {
			editor.remove(getPendingNewTokenIdKey(tokenContext));
			return this;
		}

		public Editor removePendingNewTokenCommand() {
			editor.remove(getPendingNewTokenCommandUuidKey(tokenContext));
			editor.remove(getPendingNewTokenCommandTraceKey(tokenContext));
			editor.remove(getPendingNewTokenCommandAttestationKey(tokenContext));
			editor.remove(getPendingNewTokenCommandAttestationTypeKey(tokenContext));
			return this;
		}

		@Override
		public void close() {
			editorLock.unlock();
		}

	}

	protected static final String DEFAULT_KEY_ALIAS_PREFIX = "entur-tokens";

	protected static final String TOKEN_ID = "tokenId";
	protected static final String TOKEN_VALIDITY_START = "tokenValidityStart";
	protected static final String TOKEN_VALIDITY_END = "tokenValidityEnd";

	protected static final String PENDING_RENEWAL_TOKEN_ID = "pendingRenewalTokenId";
	protected static final String PENDING_RENEWAL_TOKEN_COMMAND_UUID = "pendingRenewalCommandUuid";
	protected static final String PENDING_RENEWAL_TOKEN_COMMAND_ATTESTATION = "pendingRenewalCommandAttestation";
	protected static final String PENDING_RENEWAL_TOKEN_COMMAND_ATTESTATION_TYPE = "pendingRenewalCommandAttestationType";
	protected static final String PENDING_RENEWAL_TOKEN_COMMAND_TRACE = "pendingRenewalCommandTrace";

	protected static final String PENDING_NEW_TOKEN_ID = "pendingNewTokenId";
	protected static final String PENDING_NEW_TOKEN_COMMAND_UUID = "pendingNewTokenCommandUuid";
	protected static final String PENDING_NEW_TOKEN_COMMAND_ATTESTATION = "pendingNewTokenCommandAttestation";
	protected static final String PENDING_NEW_TOKEN_COMMAND_ATTESTATION_TYPE = "pendingNewTokenCommandAttestationType";
	protected static final String PENDING_NEW_TOKEN_COMMAND_TRACE = "pendingNewTokenCommandTrace";

	protected static final char SEPARATOR = ':'; // do not use '-' as it is in the token

	protected final String globalPrefixWithPrefix;

	protected final SharedPreferences preferences;

	protected Lock editorLock;
	protected long editorLockTimeoutMillis;

	public DefaultTokenPropertyStore(SharedPreferences preferences, Lock editorLock, long editorLockTimeoutMillis) {
		this(DEFAULT_KEY_ALIAS_PREFIX, preferences, editorLock, editorLockTimeoutMillis);
	}

	public DefaultTokenPropertyStore(String globalPrefix, SharedPreferences preferences, Lock editorLock, long editorLockTimeoutMillis) {
		// prefix can't contain separator, as we have to parse the property values
		for (int i = 0; i < globalPrefix.length(); i++) {
			if (globalPrefix.charAt(i) == DefaultTokenPropertyStore.SEPARATOR) {
				throw new IllegalStateException("Expected global property store prefix without '" + DefaultTokenPropertyStore.SEPARATOR + "'");
			}
		}
		this.globalPrefixWithPrefix = globalPrefix + SEPARATOR;
		this.preferences = preferences;
		this.editorLock = editorLock;
		this.editorLockTimeoutMillis = editorLockTimeoutMillis;
	}

	public String getTokenIdKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, TOKEN_ID);
	}

	public String getTokenValidityStartKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, TOKEN_VALIDITY_START);
	}

	public String getTokenValidityEndKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, TOKEN_VALIDITY_END);
	}

	public String getPendingRenewalTokenIdKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_RENEWAL_TOKEN_ID);
	}

	public String getPendingRenewalTokenCommandUuidKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_RENEWAL_TOKEN_COMMAND_UUID);
	}

	public String getPendingRenewalTokenCommandAttestationKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_RENEWAL_TOKEN_COMMAND_ATTESTATION);
	}

	public String getPendingRenewalTokenCommandAttestationTypeKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_RENEWAL_TOKEN_COMMAND_ATTESTATION_TYPE);
	}

	public String getPendingRenewalTokenCommandTraceKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_RENEWAL_TOKEN_COMMAND_TRACE);
	}

	public String getPendingNewTokenIdKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_NEW_TOKEN_ID);
	}

	public String getPendingNewTokenCommandUuidKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_NEW_TOKEN_COMMAND_UUID);
	}

	public String getPendingNewTokenCommandAttestationKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_NEW_TOKEN_COMMAND_ATTESTATION);
	}

	public String getPendingNewTokenCommandAttestationTypeKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_NEW_TOKEN_COMMAND_ATTESTATION_TYPE);
	}

	public String getPendingNewTokenCommandTraceKey(TokenContext tokenContext) {
		return withPrefix(tokenContext, PENDING_NEW_TOKEN_COMMAND_TRACE);
	}

	@Override
	public Set<String> getTokenContextIds() {
		Set<String> set = new HashSet<>();

		Map<String, ?> all = preferences.getAll();
		for (Map.Entry<String, ?> entry : all.entrySet()) {
			String key = entry.getKey();
			if (key.startsWith(globalPrefixWithPrefix)) {
				if (key.endsWith(TOKEN_ID) || key.endsWith(PENDING_NEW_TOKEN_ID) || key.endsWith(PENDING_RENEWAL_TOKEN_ID)) {
					// globalPrefixWithPrefix + tokenContext.getId() + SEPARATOR + key;
					int index = key.indexOf(SEPARATOR, globalPrefixWithPrefix.length());
					if (index != -1) {
						String tokenContextId = key.substring(globalPrefixWithPrefix.length(), index);

						set.add(tokenContextId);
					}
				}
			}
		}

		return set;
	}

	@Override
	public Editor getEditor(TokenContext tokenContext) throws TokenPropertyStoreException {
		// NOTE: MUST BE CLOSED
		try {
			if (editorLock.tryLock(editorLockTimeoutMillis, TimeUnit.MILLISECONDS)) {
				return new DefaultEditor(preferences.edit(), tokenContext);
			}
			throw new TokenPropertyStoreException("Timeout waiting " + editorLockTimeoutMillis + " ms for editor lock");
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenPropertyStoreException(e);
		}
	}

	@Override
	public Reader getReader(TokenContext tokenContext) {
		return new DefaultReader(tokenContext);
	}

	public String getTokenId(TokenContext tokenContext) {
		return preferences.getString(getTokenIdKey(tokenContext), null);
	}

	public Instant getTokenValidityStart(TokenContext tokenContext) {
		long aLong = preferences.getLong(getTokenValidityStartKey(tokenContext), -1L);
		if (aLong != -1L) {
			return Instant.ofEpochMilli(aLong);
		}
		return null;
	}

	public Instant getTokenValidityEnd(TokenContext tokenContext) {
		long aLong = preferences.getLong(getTokenValidityEndKey(tokenContext), -1L);
		if (aLong != -1L) {
			return Instant.ofEpochMilli(aLong);
		}
		return null;
	}

	public String getPendingRenewalTokenId(TokenContext tokenContext) {
		return preferences.getString(getPendingRenewalTokenIdKey(tokenContext), null);
	}

	public byte[] getPendingRenewalTokenCommandAttestation(TokenContext tokenContext) {
		String key = getPendingRenewalTokenCommandAttestationKey(tokenContext);
		String command = preferences.getString(key, null);
		if (command != null) {
			return Base64.decode(command, Base64.NO_WRAP);
		}
		return null;
	}

	public String getPendingRenewalTokenCommandAttestationType(TokenContext tokenContext) {
		String key = getPendingRenewalTokenCommandAttestationTypeKey(tokenContext);
		return preferences.getString(key, null);
	}

	public byte[] getPendingRenewalTokenCommandTrace(TokenContext tokenContext) {
		String key = getPendingRenewalTokenCommandTraceKey(tokenContext);
		String command = preferences.getString(key, null);
		if (command != null) {
			return Base64.decode(command, Base64.NO_WRAP);
		}
		return null;
	}

	public String getPendingRenewalTokenCommandUuid(TokenContext tokenContext) {
		String key = getPendingRenewalTokenCommandUuidKey(tokenContext);
		return preferences.getString(key, null);
	}

	public String getPendingNewTokenId(TokenContext tokenContext) {
		return preferences.getString(getPendingNewTokenIdKey(tokenContext), null);
	}

	public String getPendingNewTokenCommandUuid(TokenContext tokenContext) {
		String key = getPendingNewTokenCommandUuidKey(tokenContext);
		return preferences.getString(key, null);
	}

	public byte[] getPendingNewTokenCommandAttestation(TokenContext tokenContext) {
		String key = getPendingNewTokenCommandAttestationKey(tokenContext);
		String command = preferences.getString(key, null);
		if (command != null) {
			return Base64.decode(command, Base64.NO_WRAP);
		}
		return null;
	}

	public String getPendingNewTokenCommandAttestationType(TokenContext tokenContext) {
		String key = getPendingNewTokenCommandAttestationTypeKey(tokenContext);
		return preferences.getString(key, null);
	}

	public byte[] getPendingNewTokenCommandTrace(TokenContext tokenContext) {
		String key = getPendingNewTokenCommandTraceKey(tokenContext);
		String command = preferences.getString(key, null);
		if (command != null) {
			return Base64.decode(command, Base64.NO_WRAP);
		}
		return null;
	}

	private String withPrefix(TokenContext tokenContext, String key) {
		return globalPrefixWithPrefix + tokenContext.getId() + SEPARATOR + key;
	}

	public void clearAll() throws TokenPropertyStoreException {
		try {
			if (editorLock.tryLock(editorLockTimeoutMillis, TimeUnit.MILLISECONDS)) {
				try {
					SharedPreferences.Editor edit = preferences.edit();
					Map<String, ?> all = preferences.getAll();
					for (Map.Entry<String, ?> entry : all.entrySet()) {
						String key = entry.getKey();
						if (key.startsWith(globalPrefixWithPrefix)) {
							edit.remove(key);
						}
					}

					if (!edit.commit()) {
						// this should really not happen, since we're using locks
						throw new IllegalStateException("Problem committing preferences when clearing all");
					}
				} finally {
					editorLock.unlock();
				}
			} else {
				throw new TokenPropertyStoreException("Timeout waiting " + editorLockTimeoutMillis + " ms for editor lock");
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenPropertyStoreException(e);
		}

	}

}
