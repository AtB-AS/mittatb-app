package no.entur.abt.android.token;

import android.util.Log;

import java.io.ByteArrayInputStream;
import java.security.KeyPair;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.UnrecoverableEntryException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.time.Clock;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.jetbrains.annotations.NotNull;

import com.google.protobuf.GeneratedMessageLite;
import com.google.protobuf.InvalidProtocolBufferException;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.attestation.DeviceAttestator;
import no.entur.abt.android.token.exception.TokenSupersededException;
import no.entur.abt.android.token.keystore.TokenKeyStore;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.keystore.TokenTrustChain;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.NonceOnlyAttestation;

/**
 * Token store (backed by preferences). Tokens can exist in three persisted states: <br>
 * <br>
 * - pending new token <br>
 * - activated token <br>
 * - pending renew token <br>
 * <br>
 * This class relies on external synchronization to keep a consistent state.
 */

public class TokenStore<T> {

	private static String TAG = TokenStore.class.getName();

	protected final TokenKeyStore keyStore;
	protected final Clock clock;
	protected final TokenEncoder tokenEncoder;

	protected Provider provider;

	protected TokenPropertyStore tokenPropertyStore;
	protected DeviceAttestator deviceAttestator;
	protected TraceMapper<T> traceMapper;

	public TokenStore(TokenKeyStore keyStore, TokenEncoder tokenEncoder, Clock clock, Provider provider, TokenPropertyStore tokenPropertyStore,
			TraceMapper<T> traceMapper) {
		this.keyStore = keyStore;
		this.tokenEncoder = tokenEncoder;
		this.clock = clock;
		this.provider = provider;

		this.tokenPropertyStore = tokenPropertyStore;
		this.traceMapper = traceMapper;
	}

	public void setDeviceAttestator(DeviceAttestator deviceAttestator) {
		this.deviceAttestator = deviceAttestator;
	}

	public Token getToken(TokenContext<T> tokenContext) throws TokenPropertyStoreException {
		// the strain should normally be the latest always, but add an
		// extra check
		Token token = tokenContext.getToken();
		if (token == null || !token.isLatestStrain()) {
			token = loadToken(tokenContext);
			tokenContext.setToken(token);
		}
		if (token == null) {
			return null;
		}
		if (token instanceof ActivatedToken) {
			token = ((ActivatedToken<T>) token).forward();
		}
		return token;
	}

	protected Token loadToken(TokenContext<T> tokenContext) throws TokenPropertyStoreException {
		PendingToken pendingNewToken = loadPendingNewToken(tokenContext);
		if (pendingNewToken != null) {
			return pendingNewToken;
		}

		return loadActivatedToken(tokenContext);
	}

	protected Token loadActivatedToken(TokenContext tokenContext) throws TokenPropertyStoreException {

		TokenPropertyStore.Reader reader = tokenPropertyStore.getReader(tokenContext);

		String tokenId = reader.getTokenId();
		if (tokenId == null) {
			return null;
		}

		try {
			PrivateKey signatureKey = keyStore.getSignaturePrivateKey(tokenContext, tokenId);
			PrivateKey encryptionKey = keyStore.getEncryptionPrivateKey(tokenContext, tokenId);
			Certificate signatureCertificate = keyStore.getSignatureCertificate(tokenContext, tokenId);
			Certificate encryptCertificate = keyStore.getEncryptionCertificate(tokenContext, tokenId);

			Instant start = reader.getTokenValidityStart();
			Instant end = reader.getTokenValidityEnd();

			int strain = tokenContext.incrementStrainNumber();

			ActivatedToken<T> token = new ActivatedToken<>(tokenId, start, end, new KeyPair(signatureCertificate.getPublicKey(), signatureKey),
					new KeyPair(encryptCertificate.getPublicKey(), encryptionKey), signatureCertificate, encryptCertificate, tokenEncoder, clock, strain,
					tokenContext);
			token.setRenewToken(loadPendingRenewalToken(tokenContext, strain));
			return token;
		} catch (Exception e) {
			Log.e(TAG, "Unable to load activated token, discarding token for context " + tokenContext.getId() + ".", e);
			// wipe invalid data
			clearToken(tokenContext);
			return null;
		}
	}

	protected PendingToken loadPendingRenewalToken(TokenContext<T> tokenContext, int strainNumber)
			throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException, TokenKeystoreException, TokenPropertyStoreException {

		TokenPropertyStore.Reader reader = tokenPropertyStore.getReader(tokenContext);

		String pendingIdToken = reader.getPendingRenewalTokenId();
		if (pendingIdToken == null) {
			Log.d(TAG, "No pending renewal token for " + tokenContext.getId());
			return null;
		}
		Log.d(TAG, "Found pending renewal token for " + tokenContext.getId());

		try {
			TokenTrustChain signatureTrustChain = keyStore.getSignatureTrustChain(tokenContext, pendingIdToken);
			TokenTrustChain encryptionTrustChain = keyStore.getEncryptionTrustChain(tokenContext, pendingIdToken);

			KeyPair signatureKeyPair = signatureTrustChain.getKeyPair();
			KeyPair encryptionKeyPair = encryptionTrustChain.getKeyPair();

			String commandUuid = reader.getPendingRenewalTokenCommandUuid();

			GeneratedMessageLite commandAttestation = parseAttestation(reader.getPendingRenewalTokenCommandAttestation(),
					reader.getPendingRenewalTokenCommandAttestationType());

			T commandTrace = traceMapper.fromBytes(reader.getPendingRenewalTokenCommandTrace());

			return new PendingToken(pendingIdToken, signatureKeyPair, encryptionKeyPair, tokenEncoder, tokenContext.incrementStrainNumber(), commandUuid,
					commandAttestation, signatureTrustChain.getCertificateChain(), encryptionTrustChain.getCertificateChain(), commandTrace, tokenContext);
		} catch (Exception e) {
			Log.e(TAG, "Unable to load pending new token, discarding.", e);
			clearPendingRenewableToken(tokenContext);
			return null;
		}
	}

	protected static GeneratedMessageLite parseAttestation(byte[] attestation, String type) throws InvalidProtocolBufferException {
		// note: do not use class getname becaues of obfuscation
		if (type.equals("NonceOnlyAttestation")) {
			return NonceOnlyAttestation.parseFrom(attestation);
		}
		if (type.equals("AndroidSafetyNetAttestation")) {
			return AndroidSafetyNetAttestation.parseFrom(attestation);
		}

		throw new IllegalStateException();
	}

	protected static String getAttetationType(GeneratedMessageLite object) {
		// note: do not use class getname becaues of obfuscation
		if (object instanceof NonceOnlyAttestation) {
			return "NonceOnlyAttestation";
		}
		if (object instanceof AndroidSafetyNetAttestation) {
			return "AndroidSafetyNetAttestation";
		}
		throw new IllegalStateException();
	}

	public Set<String> getTokenContextIds() {
		return tokenPropertyStore.getTokenContextIds();
	}

	public void clearToken(TokenContext tokenContext) throws TokenPropertyStoreException {
		tokenContext.incrementStrainNumber();

		try {
			keyStore.removeTokens(tokenContext);
		} catch (TokenKeystoreException e) {
			// log and ignore
			Log.w(TAG, "Problem deleting tokens", e);
		}

		try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {

			editor.removeToken();
			editor.removePendingRenewalToken();
			editor.removePendingNewToken();

			editor.commitOrThrowException();

			tokenContext.setToken(null);
		}
	}

	protected void saveToken(ActivatedToken<T> token) throws TokenPropertyStoreException {
		// so the activated token came from renewal of a token, or from a new token

		// keep the keystore entries for the current token id, and the pending token id
		// delete the rest, including fields.
		Set<String> keep = new HashSet<>();
		keep.add(token.getTokenId());
		Token<T> renewToken = token.getRenewToken();
		if (renewToken != null) {
			if (renewToken instanceof ActivatedToken) {
				throw new IllegalArgumentException();
			}
			keep.add(renewToken.getTokenId());
		}

		TokenContext<T> tokenContext = token.getTokenContext();

		try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {

			prepareEditor(editor, tokenContext, keep);

			// save token
			editor.setToken(token.getTokenId(), token.getValidityStart(), token.getValidityEnd());

			// save pending token, if any
			if (renewToken != null) {
				PendingToken<T> pending = (PendingToken<T>) renewToken;
				editor.setPendingRenewalToken(renewToken.getTokenId(), pending.getCommandUuid(), pending.getCommandAttestation().toByteArray(),
						getAttetationType(pending.getCommandAttestation()), traceMapper.toBytes(pending.getCommandTrace()));
			}

			editor.commitOrThrowException();
		}
	}

	private void prepareEditor(TokenPropertyStore.Editor editor, TokenContext<T> tokenContext, String tokenId) {
		Set<String> keep = new HashSet<>();
		keep.add(tokenId);
		prepareEditor(editor, tokenContext, keep);
	}

	/**
	 * Remove all existing tokens keys from preferences, and delete keys for tokens not in argument set.
	 *
	 * @param editor         preference-backed editor
	 * @param tokenContext   token context
	 * @param tokenIdsToKeep set of token ids to keep in keystore
	 */

	private void prepareEditor(TokenPropertyStore.Editor editor, TokenContext<T> tokenContext, Set<String> tokenIdsToKeep) {
		prepareEditorPreviousActiveToken(editor, tokenContext, tokenIdsToKeep);
		prepareEditorPendingNewToken(editor, tokenContext, tokenIdsToKeep);
		prepareEditorPendingPendingRenewableToken(editor, tokenContext, tokenIdsToKeep);
	}

	private void prepareEditorPendingPendingRenewableToken(TokenPropertyStore.Editor editor, TokenContext<T> tokenContext, Set<String> tokenIdsToKeep) {
		String pendingRenewableTokenId = editor.getPendingRenewalTokenId();
		if (pendingRenewableTokenId != null) {
			if (!tokenIdsToKeep.contains(pendingRenewableTokenId)) {
				try {
					keyStore.removeToken(tokenContext, pendingRenewableTokenId);
				} catch (TokenKeystoreException e) {
					// log and ignore
					Log.w(TAG, "Unable to delete pending renewal token keys", e);
				}
			}
			editor.removePendingRenewalToken();
		}
	}

	private void prepareEditorPendingNewToken(TokenPropertyStore.Editor editor, TokenContext<T> tokenContext, Set<String> tokenIdsToKeep) {
		String pendingNewTokenId = editor.getPendingNewTokenId();
		if (pendingNewTokenId != null) {
			if (!tokenIdsToKeep.contains(pendingNewTokenId)) {
				try {
					keyStore.removeToken(tokenContext, pendingNewTokenId);
				} catch (TokenKeystoreException e) {
					// log and ignore
					Log.w(TAG, "Unable to delete pending new token keys", e);
				}
			}
			editor.removePendingNewToken();
		}
	}

	private void prepareEditorPreviousActiveToken(TokenPropertyStore.Editor editor, TokenContext<T> tokenContext, Set<String> tokenIdsToKeep) {
		String previousActiveTokenId = editor.getTokenId();
		if (previousActiveTokenId != null) {
			if (!tokenIdsToKeep.contains(previousActiveTokenId)) {
				try {
					keyStore.removeToken(tokenContext, previousActiveTokenId);
				} catch (TokenKeystoreException e) {
					// log and ignore
					Log.w(TAG, "Unable to delete previous activated keys", e);
				}
			}
			editor.removeToken();
		}
	}

	protected PendingToken loadPendingNewToken(TokenContext<T> tokenContext) throws TokenPropertyStoreException {
		TokenPropertyStore.Reader reader = tokenPropertyStore.getReader(tokenContext);

		String pendingIdToken = reader.getPendingNewTokenId();
		if (pendingIdToken == null) {
			return null;
		}

		try {
			TokenTrustChain signatureTrustChain = keyStore.getSignatureTrustChain(tokenContext, pendingIdToken);
			TokenTrustChain encryptionTrustChain = keyStore.getEncryptionTrustChain(tokenContext, pendingIdToken);

			KeyPair signatureKeyPair = signatureTrustChain.getKeyPair();
			KeyPair encryptionKeyPair = encryptionTrustChain.getKeyPair();

			T commandTrace = traceMapper.fromBytes(reader.getPendingNewTokenCommandTrace());

			GeneratedMessageLite commandAttestation = parseAttestation(reader.getPendingNewTokenCommandAttestation(),
					reader.getPendingNewTokenCommandAttestationType());

			String commandUuid = reader.getPendingNewTokenCommandUuid();

			return new PendingToken(pendingIdToken, signatureKeyPair, encryptionKeyPair, tokenEncoder, tokenContext.incrementStrainNumber(), commandUuid,
					commandAttestation, signatureTrustChain.getCertificateChain(), encryptionTrustChain.getCertificateChain(), commandTrace, tokenContext);
		} catch (Exception e) {
			Log.e(TAG, "Unable to load pending new token, discarding.", e);
			clearPendingNewToken(tokenContext);
			return null;
		}
	}

	protected void clearActiveTokenImpl(TokenContext<T> tokenContext, TokenPropertyStore.Editor editor, String tokenId) {
		try {
			keyStore.removeToken(tokenContext, tokenId);
		} catch (TokenKeystoreException e) {
			// log and ignore
			Log.w(TAG, "Unable to delete previous key for token", e);
		}

		editor.removeToken();

		Token token = tokenContext.getToken();
		if (token != null && token.getTokenId().equals(tokenId)) {
			tokenContext.setToken(null);
		}
	}

	public void clearPendingNewToken(TokenContext<T> tokenContext) throws TokenPropertyStoreException {
		TokenPropertyStore.Reader reader = tokenPropertyStore.getReader(tokenContext);

		String newTokenId = reader.getPendingNewTokenId();
		if (newTokenId != null) {
			try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {
				clearPendingNewTokenImpl(tokenContext, editor, newTokenId);
				editor.commitOrThrowException();
			}
		}
	}

	private void clearPendingNewTokenImpl(TokenContext<T> tokenContext, TokenPropertyStore.Editor editor, String tokenId) {
		try {
			keyStore.removeToken(tokenContext, tokenId);
		} catch (TokenKeystoreException e) {
			// log and ignore
			Log.w(TAG, "Unable to delete previous key for token", e);
		}

		editor.removePendingNewToken();

		Token token = tokenContext.getToken();
		if (token != null && token.getTokenId().equals(tokenId)) {
			tokenContext.setToken(null);
		}
	}

	public void clearPendingRenewableToken(ActivatedToken<T> token) throws TokenPropertyStoreException {
		clearPendingRenewableToken(token.getTokenContext());
		token.setRenewToken(null);
	}

	public void clearPendingRenewableToken(TokenContext<T> tokenContext) throws TokenPropertyStoreException {
		TokenPropertyStore.Reader reader = tokenPropertyStore.getReader(tokenContext);
		String tokenId = reader.getPendingRenewalTokenId();
		if (tokenId != null) {
			try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {
				clearPendingRenewableTokenImpl(tokenContext, editor, tokenId);
				editor.commitOrThrowException();
			}
		}
	}

	protected void clearPendingRenewableTokenImpl(TokenContext<T> tokenContext, TokenPropertyStore.Editor editor, String tokenId) {
		try {
			keyStore.removeToken(tokenContext, tokenId);
		} catch (TokenKeystoreException e) {
			// log and ignore
			Log.w(TAG, "Unable to delete previous key for token", e);
		}

		editor.removePendingRenewalToken();
	}

	protected void savePendingNewToken(PendingToken<T> token) throws TokenPropertyStoreException {
		TokenContext<T> tokenContext = token.getTokenContext();

		try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {
			prepareEditor(editor, tokenContext, token.getTokenId());

			editor.setPendingNewToken(token.getTokenId(), token.getCommandUuid(), token.getCommandAttestation().toByteArray(),
					getAttetationType(token.getCommandAttestation()), traceMapper.toBytes(token.getCommandTrace()));

			editor.commitOrThrowException();
		}
	}

	public ActivatedToken<T> convertPendingTokenToActiveTokenWhichMustBeRenewed(ActivatedToken<T> activatedToken, PendingToken<T> token)
			throws TokenPropertyStoreException {
		ActivatedToken<T> renewActivatedToken = convertPendingTokenToActiveTokenWithZeroValidity(token);
		activatedToken.setRenewToken(renewActivatedToken);
		activatedToken.markMustBeRenewed();

		return renewActivatedToken;
	}

	protected ActivatedToken<T> convertPendingTokenToActiveTokenWithZeroValidity(PendingToken<T> token) throws TokenPropertyStoreException {
		TokenContext<T> tokenContext = token.getTokenContext();

		try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {
			prepareEditor(editor, tokenContext, token.getTokenId()); // clears tokens (except from keystore entry for the argument token)

			Instant validityStart = Instant.EPOCH;
			Instant validityEnd = Instant.EPOCH;

			// save token as active - there will be a pending token regardless
			editor.setToken(token.getTokenId(), validityStart, validityEnd);

			editor.commitOrThrowException();

			ActivatedToken<T> activatedToken = new ActivatedToken<>(token.getTokenId(), validityStart, validityEnd, token.getSignatureKey(),
					token.getEncryptKey(), null, null, tokenEncoder, clock, token.getStrainNumber(), tokenContext);

			tokenContext.setToken(activatedToken); // XXX or token?

			return activatedToken;
		}
	}

	public ActivatedToken<T> convertPendingTokenToActiveToken(ActivatedToken<T> activatedToken, PendingToken<T> token, byte[] certificate,
			Instant validityStart, Instant validityEnd) throws CertificateException, KeyStoreException, TokenPropertyStoreException, TokenKeystoreException {
		ActivatedToken<T> renewedActivatedToken = convertPendingTokenToActiveTokenImpl(token, certificate, validityStart, validityEnd);
		activatedToken.setRenewToken(renewedActivatedToken);

		return renewedActivatedToken;
	}

	public ActivatedToken<T> convertPendingTokenToActiveToken(PendingToken<T> token, byte[] certificate, Instant validityStart, Instant validityEnd)
			throws CertificateException, KeyStoreException, TokenPropertyStoreException, TokenKeystoreException {
		return convertPendingTokenToActiveTokenImpl(token, certificate, validityStart, validityEnd);
	}

	protected ActivatedToken<T> convertPendingTokenToActiveTokenImpl(PendingToken<T> token, byte[] certificate, Instant validityStart, Instant validityEnd)
			throws CertificateException, KeyStoreException, TokenPropertyStoreException, TokenKeystoreException {

		Log.d(TAG, "Add certificate to keystore");

		TokenContext<T> tokenContext = token.getTokenContext();

		keyStore.setSignatureCertificate(tokenContext, token.getTokenId(), token.getSignatureKey().getPrivate(),
				getCertificateFactory().generateCertificate(new ByteArrayInputStream(certificate)));

		try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(tokenContext)) {
			prepareEditor(editor, tokenContext, token.getTokenId()); // clears tokens (except from keystore entry for the argument token)

			editor.setToken(token.getTokenId(), validityStart, validityEnd);

			editor.commitOrThrowException();
		}

		Certificate encryptCertificate = keyStore.getEncryptionCertificate(tokenContext, token.getTokenId());

		ActivatedToken<T> activatedToken = new ActivatedToken<>(token.getTokenId(), validityStart, validityEnd, token.getSignatureKey(), token.getEncryptKey(),
				getCertificateFactory().generateCertificate(new ByteArrayInputStream(certificate)), encryptCertificate, tokenEncoder, clock,
				token.getStrainNumber(), tokenContext);

		tokenContext.setToken(activatedToken);

		return activatedToken;
	}

	@NotNull
	public PendingToken<T> createPendingNewToken(TokenContext<T> tokenContext, String tokenId, byte[] nonce, T traceId)
			throws TokenKeystoreException, DeviceAttestationException, TokenPropertyStoreException {
		Log.d(TAG, "Generated signature + encryption key pair for new token " + tokenId + " for token context id " + tokenContext.getId());

		final TokenTrustChain signatureChain = createSignatureKey(tokenContext, tokenId, nonce);
		final TokenTrustChain encryptionChain = createEncryptionKey(tokenContext, tokenId, nonce);

		Log.d(TAG, "Attesting nonce for new token " + tokenId + " for token context id " + tokenContext.getId() + "..");
		GeneratedMessageLite attestation = deviceAttestator.attest(nonce, signatureChain.getPublicEncoded(), encryptionChain.getPublicEncoded());
		String uuid = UUID.randomUUID().toString();

		Log.d(TAG, "Create pending new token " + tokenId + " for token context id " + tokenContext.getId() + "..");

		KeyPair signaturePrivateKey = signatureChain.getKeyPair();
		KeyPair encryptionPrivateKey = encryptionChain.getKeyPair();

		PendingToken<T> pendingNewToken = new PendingToken(tokenId, signaturePrivateKey, encryptionPrivateKey, tokenEncoder,
				tokenContext.incrementStrainNumber(), uuid, attestation, signatureChain.getCertificateChain(), encryptionChain.getCertificateChain(), traceId,
				tokenContext);
		savePendingNewToken(pendingNewToken);
		tokenContext.setToken(pendingNewToken);
		return pendingNewToken;
	}

	public void validateLatestStrain(Token<T> token) throws TokenSupersededException {
		if (!token.isLatestStrain()) {
			throw new TokenSupersededException(
					"Cannot renew token for strain " + token.getStrainNumber() + ", has been replaced by strain " + token.getTokenContext().getStrainNumber());
		}
	}

	public PendingToken<T> createPendingToken(ActivatedToken<T> activateToken, String tokenId, byte[] nonce, T trace)
			throws TokenKeystoreException, DeviceAttestationException, TokenPropertyStoreException {

		Log.d(TAG, "Generated signature + encryption key pair for token " + tokenId + " renewal");

		final TokenTrustChain signatureChain = createSignatureKey(activateToken.getTokenContext(), tokenId, nonce);
		final TokenTrustChain encryptionChain = createEncryptionKey(activateToken.getTokenContext(), tokenId, nonce);

		Log.d(TAG, "Attesting nonce for renewal token " + tokenId + " ..");
		GeneratedMessageLite attestation = deviceAttestator.attest(nonce, signatureChain.getPublicEncoded(), encryptionChain.getPublicEncoded());
		String uuid = UUID.randomUUID().toString();

		TokenContext<T> tokenContext = activateToken.getTokenContext();

		KeyPair signaturePrivateKey = signatureChain.getKeyPair();
		KeyPair encryptionPrivateKey = encryptionChain.getKeyPair();

		PendingToken<T> pendingToken = new PendingToken(tokenId, signaturePrivateKey, encryptionPrivateKey, tokenEncoder, activateToken.getStrainNumber(), uuid,
				attestation, signatureChain.getCertificateChain(), encryptionChain.getCertificateChain(), trace, tokenContext);

		activateToken.setRenewToken(pendingToken);

		saveToken(activateToken);

		Log.d(TAG, "Created pending renewal token " + tokenId);

		return pendingToken;
	}

	public void clearToken(Token<T> token) throws TokenPropertyStoreException {
		try (TokenPropertyStore.Editor editor = tokenPropertyStore.getEditor(token.getTokenContext())) {
			TokenContext<T> tokenContext = token.getTokenContext();

			String id = editor.getPendingNewTokenId();
			if (id != null && id.equals(token.getTokenId())) {
				clearPendingNewTokenImpl(tokenContext, editor, id);
			}

			id = editor.getPendingRenewalTokenId();
			if (id != null && id.equals(token.getTokenId())) {
				clearPendingRenewableTokenImpl(tokenContext, editor, id);
			}

			id = editor.getTokenId();
			if (id != null && id.equals(token.getTokenId())) {
				clearActiveTokenImpl(tokenContext, editor, id);
			}

			editor.commitOrThrowException();

			Token<T> currentToken = tokenContext.getToken();
			if (currentToken != null && currentToken.getTokenId().equals(token.getTokenId())) {
				tokenContext.setToken(null);
			}
		}

	}

	public CertificateFactory getCertificateFactory() throws CertificateException {
		if (provider != null) {
			return CertificateFactory.getInstance("X.509", provider);
		} else {
			return CertificateFactory.getInstance("X.509");
		}
	}

	public void clearAll() throws TokenPropertyStoreException, TokenKeystoreException {
		keyStore.removeTokens();
		tokenPropertyStore.clearAll();
	}

	public TokenTrustChain createSignatureKey(TokenContext<T> tokenContext, String tokenId, byte[] nonce) throws TokenKeystoreException {
		return keyStore.createSignatureKey(tokenContext, tokenId, nonce);
	}

	public TokenTrustChain createEncryptionKey(TokenContext<T> tokenContext, String tokenId, byte[] nonce) throws TokenKeystoreException {
		return keyStore.createEncryptionKey(tokenContext, tokenId, nonce);
	}

}
