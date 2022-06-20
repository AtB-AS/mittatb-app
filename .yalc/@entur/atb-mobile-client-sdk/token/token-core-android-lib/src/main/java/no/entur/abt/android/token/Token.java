package no.entur.abt.android.token;

import android.util.Log;

import java.security.KeyPair;
import java.security.PublicKey;
import java.util.concurrent.atomic.AtomicInteger;

import javax.crypto.Cipher;

import no.entur.abt.android.token.exception.UnableToDecryptException;
import no.entur.abt.android.token.exception.UnableToIncludeCertificateException;
import no.entur.abt.android.token.exception.UnableToPerformCryptoOperationTokenException;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

/**
 * 
 * Base class for tokens.
 * 
 */

public abstract class Token<T> {

	protected static final String TAG = Token.class.getName();

	protected static final String ENCRYPTION_KEY_CIPHER = "RSA/ECB/PKCS1Padding";

	protected final String tokenId;
	protected final KeyPair signatureKey;
	protected final KeyPair encryptKey;
	protected final TokenEncoder tokenEncoder;
	/** Per-token-context counter */
	protected final int strainNumber;
	protected final TokenContext<T> tokenContext;

	// this is a helper for handling device reattestation when using this token.
	// Save the count before performing a request, upon receiving a reatteastion
	// request, add a synchronization lock and compare the count found here to
	// determine whether another thread has already done the reattestation when
	// the lock is acquired
	protected AtomicInteger deviceAttestationCounter = new AtomicInteger();

	public Token(String tokenId, KeyPair signatureKey, KeyPair encryptKey, TokenEncoder tokenEncoder, int strainNumber, TokenContext<T> tokenContext) {
		this.tokenId = tokenId;
		this.signatureKey = signatureKey;
		this.encryptKey = encryptKey;
		this.tokenEncoder = tokenEncoder;
		this.strainNumber = strainNumber;
		this.tokenContext = tokenContext;
	}

	public String getTokenId() {
		return tokenId;
	}

	protected KeyPair getSignatureKey() {
		return signatureKey;
	}

	public byte[] decryptVisualInspectionNonce(byte[] encryptedVisualInspectionNonce)
			throws UnableToPerformCryptoOperationTokenException, UnableToDecryptException {
		Log.d(TAG, "Sign using token " + tokenId);
		Cipher cipher;
		try {
			cipher = Cipher.getInstance(ENCRYPTION_KEY_CIPHER);
			cipher.init(Cipher.DECRYPT_MODE, encryptKey.getPrivate());
		} catch (Exception e) {
			throw new UnableToPerformCryptoOperationTokenException("Unable to initialize cipher for decryption", e);
		}
		try {
			return cipher.doFinal(encryptedVisualInspectionNonce);
		} catch (Exception e) {
			Log.d(TAG, "Unable to decrypt visual inspection nonce");
			throw new UnableToDecryptException();
		}
	}

	public SecureContainer encodeAsSecureContainer(TokenEncodingRequest tokenEncodingRequest)
			throws UnableToPerformCryptoOperationTokenException, UnableToIncludeCertificateException {
		return tokenEncoder.encodeAsSecureContainer(tokenEncodingRequest, this);
	}

	protected KeyPair getEncryptKey() {
		return encryptKey;
	}

	public PublicKey getEncryptPublicKey() {
		return encryptKey.getPublic();
	}

	public PublicKey getSignaturePublicKey() {
		return signatureKey.getPublic();
	}

	public int getStrainNumber() {
		return strainNumber;
	}

	public boolean isLatestStrain() {
		return tokenContext.isLatestStrain(strainNumber);
	}

	public TokenContext<T> getTokenContext() {
		return tokenContext;
	}

	protected TokenEncoder getTokenEncoder() {
		return tokenEncoder;
	}

	public int getDeviceAttestationCount() {
		return deviceAttestationCounter.get();
	}

	public void incrementDeviceAttestationCounter() {
		deviceAttestationCounter.incrementAndGet();
	}

	public boolean isDeviceAttestationIncrement(int reference) {
		return reference < deviceAttestationCounter.get();
	}
}
