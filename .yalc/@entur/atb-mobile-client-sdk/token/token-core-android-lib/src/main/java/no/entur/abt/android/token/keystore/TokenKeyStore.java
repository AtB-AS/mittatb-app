package no.entur.abt.android.token.keystore;

import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.UnrecoverableEntryException;
import java.security.cert.Certificate;

import no.entur.abt.android.token.TokenContext;

public interface TokenKeyStore<T> {

	TokenTrustChain createEncryptionKey(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge) throws TokenKeystoreException;

	TokenTrustChain getEncryptionTrustChain(TokenContext<T> tokenContext, String tokenId)
			throws TokenKeystoreException, UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException;

	Certificate getEncryptionCertificate(TokenContext<T> tokenContext, String tokenId) throws KeyStoreException, TokenKeystoreException;

	PrivateKey getEncryptionPrivateKey(TokenContext<T> tokenContext, String tokenId)
			throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException, TokenKeystoreException;

	TokenTrustChain createSignatureKey(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge) throws TokenKeystoreException;

	TokenTrustChain getSignatureTrustChain(TokenContext<T> tokenContext, String tokenId)
			throws TokenKeystoreException, UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException;

	void setSignatureCertificate(TokenContext<T> tokenContext, String tokenId, PrivateKey key, Certificate certificate)
			throws KeyStoreException, TokenKeystoreException;

	Certificate getSignatureCertificate(TokenContext<T> tokenContext, String tokenId) throws KeyStoreException, TokenKeystoreException;

	PrivateKey getSignaturePrivateKey(TokenContext<T> tokenContext, String tokenId)
			throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException, TokenKeystoreException;

	void removeTokens() throws TokenKeystoreException;

	void removeTokens(TokenContext<T> tokenContext) throws TokenKeystoreException;

	boolean hasTokens() throws TokenKeystoreException;

	boolean hasTokens(TokenContext<T> tokenContext) throws TokenKeystoreException;

	void removeToken(TokenContext<T> tokenContext, String tokenId) throws TokenKeystoreException;

}
