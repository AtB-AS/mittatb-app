package no.entur.abt.android.token.keystore;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.ProviderException;
import java.security.UnrecoverableEntryException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.spec.ECGenParameterSpec;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import no.entur.abt.android.token.TokenContext;

// IMPLEMENTATION NOTE: ALL PUBLIC METHODS MUST USE TRY-LOCK-FINALLY-UNLOCK.

public class DefaultTokenKeyStore<T> implements TokenKeyStore<T> {

	private static final String TAG = DefaultTokenKeyStore.class.getName();

	private static final long DEFAULT_LOCK_TIMEOUT = 10000;

	private static final String ENCRYPTION_KEY_ALGORITHM = KeyProperties.KEY_ALGORITHM_RSA;
	private static final int ENCRYPTION_KEY_SIZE = 2048;
	private static final String TOKEN_KEY_ALGORITHM = KeyProperties.KEY_ALGORITHM_EC;
	private static final String TOKEN_KEY_KEYGEN_SPEC = "secp256r1";

	private static final String ANDROID_KEYSTORE = "AndroidKeyStore";

	protected static final String DEFAULT_KEY_ALIAS_PREFIX = "entur-tokens";

	public static <T> Builder<T> newBuilder() {
		return new Builder<>();
	}

	public static class Builder<T> {

		private KeyStore keyStore;
		private KeystoreAliasFactory keystoreAliasFactory;
		private String keyStoreAliasPrefix;
		private Lock lock;
		private long timeout = -1L;

		public Builder<T> withKeyStoreAliasPrefix(String keyStoreAliasPrefix) {
			this.keyStoreAliasPrefix = keyStoreAliasPrefix;
			return this;
		}

		public Builder<T> withLock(Lock lock, long timeout) {
			this.lock = lock;
			this.timeout = timeout;
			return this;
		}

		public Builder<T> withKeyStore(KeyStore keyStore) {
			this.keyStore = keyStore;
			return this;
		}

		public Builder<T> withKeyAliasFactory(KeystoreAliasFactory keystoreAliasFactory) {
			this.keystoreAliasFactory = keystoreAliasFactory;
			return this;
		}

		public DefaultTokenKeyStore<T> build() throws TokenKeystoreException {
			if (keyStore == null) {
				keyStore = createAndroidKeyStore();
			}
			if (lock == null) {
				lock = new ReentrantLock();
			}
			if (timeout == -1L) {
				timeout = DEFAULT_LOCK_TIMEOUT;
			}
			if (keyStoreAliasPrefix == null) {
				keyStoreAliasPrefix = DEFAULT_KEY_ALIAS_PREFIX;
			}
			if (keystoreAliasFactory == null) {
				keystoreAliasFactory = new DefaultKeystoreAliasFactory(keyStoreAliasPrefix);
			}
			return new DefaultTokenKeyStore<>(keyStore, keystoreAliasFactory, lock, timeout);
		}

		private static KeyStore createAndroidKeyStore() throws TokenKeystoreException {
			try {
				KeyStore keyStore = KeyStore.getInstance(ANDROID_KEYSTORE);
				keyStore.load(null);
				return keyStore;
			} catch (KeyStoreException | CertificateException | IOException | NoSuchAlgorithmException e) {
				throw new TokenKeystoreException("Unable to load android keystore", e);
			}
		}
	}

	protected final KeyStore keyStore;
	protected final KeystoreAliasFactory keystoreAliasFactory;
	protected final KeystoreSearch keystoreSearch;

	// consider keystore not thread safe, so add synchronization
	// for both read and write
	protected final Lock lock;
	protected final long lockTimeout;

	protected DefaultTokenKeyStore(KeyStore keyStore, KeystoreAliasFactory keystoreAliasFactory, Lock lock, long lockTimeout) {
		this.keyStore = keyStore;

		Log.d(TAG, "Create token store with keystore provider " + keyStore.getProvider().getName());

		this.keystoreAliasFactory = keystoreAliasFactory;
		this.lock = lock;
		this.lockTimeout = lockTimeout;
		this.keystoreSearch = new DefaultKeystoreSearch(keystoreAliasFactory, keyStore);
	}

	@Override
	public void removeTokens(TokenContext<T> tokenContext) throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					Set<String> aliases = keystoreSearch.findAliases(tokenContext.getId());
					for (String s : aliases) {
						keyStore.deleteEntry(s);
					}
				} catch (KeyStoreException e) {
					throw new TokenKeystoreException("Error removing all keys from keystore for token context " + tokenContext.getId(), e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@Override
	public boolean hasTokens() throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					return !keystoreSearch.findAllAliases().isEmpty();
				} catch (KeyStoreException e) {
					throw new TokenKeystoreException("Error checking whether keystore has tokens", e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@Override
	public boolean hasTokens(TokenContext<T> tokenContext) throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					return !keystoreSearch.findAliases(tokenContext.getId()).isEmpty();
				} catch (KeyStoreException e) {
					throw new TokenKeystoreException("Error checking whether keystore has tokens for context " + tokenContext.getId(), e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@Override
	public void removeTokens() throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					Set<String> aliases = keystoreSearch.findAllAliases();
					for (String s : aliases) {
						keyStore.deleteEntry(s);
					}
				} catch (KeyStoreException e) {
					throw new TokenKeystoreException("Error removing all keys for all token contexts from keystore", e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@Override
	public void removeToken(TokenContext<T> tokenContext, String tokenId) throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					Set<String> aliases = keystoreSearch.findAliases(tokenContext.getId(), tokenId);
					for (String s : aliases) {
						keyStore.deleteEntry(s);
					}
				} catch (KeyStoreException e) {
					throw new TokenKeystoreException(
							"Error removing keys for token " + tokenId + " in token context " + tokenContext.getId() + " from keystore", e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@RequiresApi(Build.VERSION_CODES.N)
	protected KeyPair generateEncryptionKeyPair(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge)
			throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {

		String keyAlias = keystoreAliasFactory.getEncryptionKeyAlias(tokenContext.getId(), tokenId);
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(ENCRYPTION_KEY_ALGORITHM, keyStore.getProvider());

		KeyGenParameterSpec.Builder specBuilder = new KeyGenParameterSpec.Builder(keyAlias, KeyProperties.PURPOSE_DECRYPT)
				.setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
				.setKeySize(ENCRYPTION_KEY_SIZE);
		specBuilder.setAttestationChallenge(attestationChallenge);

		KeyGenParameterSpec spec = specBuilder.build();
		Log.d(TAG, "Generate using " + spec.toString());

		keyPairGenerator.initialize(spec);

		return keyPairGenerator.generateKeyPair();
	}

	@Override
	public TokenTrustChain createEncryptionKey(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge) throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					return createEncryptionKeyImpl(tokenContext, tokenId, attestationChallenge);
				} catch (Exception e) {
					throw new KeyPairExceptionToken(e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@NonNull
	protected TokenTrustChain createEncryptionKeyImpl(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge)
			throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) { // include nonce
			try {
				// include nonce. This still might not be hardware backed.
				KeyPair keyPair = generateEncryptionKeyPair(tokenContext, tokenId, attestationChallenge);

				try {
					List<byte[]> chain = getEncryptionEncodedCertificateChain(tokenContext, tokenId);
					return new TokenTrustChain(keyPair, chain);
				} catch (TokenTrustChainExceptionToken e) {
					Log.w(TAG, "Problem generating certificate chain", e);
				}

				// fall back to using only key pair
				return new TokenTrustChain(keyPair);
			} catch (ProviderException e) {
				Log.w(TAG, "Problem generating signature key pair", e);
				// some devices are
				// experiencing java.security.ProviderException: Failed to generate attestation certificate chain
				// caused by android.security.KeyStoreException: -10003

				boolean retryWithoutNonce = isRetryWithoutNonce(e);
				if (retryWithoutNonce) {
					Log.d(TAG, "Falling back to generating encryption key pair without nonce");
					KeyPair keyPair = generateEncryptionKeyPair(tokenContext, tokenId); // i.e. null challenge
					return new TokenTrustChain(keyPair);
				}
				throw e;
			}
		} else {
			KeyPair keyPair = generateEncryptionKeyPair(tokenContext, tokenId); // i.e. null challenge
			return new TokenTrustChain(keyPair);
		}
	}

	@Override
	public TokenTrustChain createSignatureKey(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge) throws TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					return createSignatureKeyImpl(tokenContext, tokenId, attestationChallenge);
				} catch (Exception e) {
					throw new KeyPairExceptionToken(e);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}

	}

	@Override
	public TokenTrustChain getSignatureTrustChain(TokenContext<T> tokenContext, String tokenId)
			throws TokenKeystoreException, UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException {
		PrivateKey signatureKey = getSignaturePrivateKey(tokenContext, tokenId);
		Certificate signatureCertificate = getSignatureCertificate(tokenContext, tokenId);
		KeyPair keyPair = new KeyPair(signatureCertificate.getPublicKey(), signatureKey);

		try {
			List<byte[]> chain = getSignatureEncodedCertificateChain(tokenContext, tokenId);
			return new TokenTrustChain(keyPair, chain);
		} catch (TokenTrustChainExceptionToken e) {
			Log.w(TAG, "Problem generating certificate chain", e);
		}

		// fall back to using only key pair
		return new TokenTrustChain(keyPair);
	}

	@Override
	public TokenTrustChain getEncryptionTrustChain(TokenContext<T> tokenContext, String tokenId)
			throws TokenKeystoreException, UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException {
		Certificate encryptionCertificate = getEncryptionCertificate(tokenContext, tokenId);
		PrivateKey encryptionKey = getEncryptionPrivateKey(tokenContext, tokenId);
		KeyPair keyPair = new KeyPair(encryptionCertificate.getPublicKey(), encryptionKey);
		try {
			List<byte[]> chain = getEncryptionEncodedCertificateChain(tokenContext, tokenId);
			return new TokenTrustChain(keyPair, chain);
		} catch (TokenTrustChainExceptionToken e) {
			Log.w(TAG, "Problem generating certificate chain", e);
		}

		// fall back to using only key pair
		return new TokenTrustChain(keyPair);
	}

	@NonNull
	private TokenTrustChain createSignatureKeyImpl(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge)
			throws InvalidAlgorithmParameterException, NoSuchAlgorithmException, TokenKeystoreException {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
			try {
				// include nonce. This still might not be hardware backed.
				KeyPair keyPair = generateSignatureKeyPair(tokenContext, tokenId, attestationChallenge);

				try {
					List<byte[]> chain = getSignatureEncodedCertificateChain(tokenContext, tokenId);
					return new TokenTrustChain(keyPair, chain);
				} catch (TokenTrustChainExceptionToken e) {
					Log.w(TAG, "Problem generating certificate chain", e);
				}

				// fall back to using only key pair
				return new TokenTrustChain(keyPair);
			} catch (ProviderException e) {
				Log.w(TAG, "Problem generating signature key pair", e);
				// some devices are
				// experiencing java.security.ProviderException: Failed to generate attestation certificate chain
				// caused by android.security.KeyStoreException: -10003

				boolean retryWithoutNonce = isRetryWithoutNonce(e);
				if (retryWithoutNonce) {
					Log.d(TAG, "Falling back to generating signature key pair without nonce");
					KeyPair keyPair = generateSignatureKeyPair(tokenContext, tokenId); // i.e. null challenge
					return new TokenTrustChain(keyPair);
				}
				throw e;
			}
		} else {
			KeyPair keyPair = generateSignatureKeyPair(tokenContext, tokenId); // i.e. null challenge
			return new TokenTrustChain(keyPair);
		}
	}

	private boolean isRetryWithoutNonce(ProviderException e) {
		boolean retryWithoutNonce = false;
		Throwable cause = e.getCause();
		if (cause != null && cause.getClass().getName().equals("android.security.KeyStoreException")) {
			// part of hidden api
			// https://github.com/aosp-mirror/platform_frameworks_base/blob/master/keystore/java/android/security/KeyStoreException.java
			// https://android.googlesource.com/platform/hardware/interfaces/+/master/keymaster/4.0/types.hal#997
			if (cause.toString().contains("-10003")) {
				retryWithoutNonce = true;
			}
		}
		return retryWithoutNonce;
	}

	@Deprecated
	protected KeyPair generateEncryptionKeyPair(TokenContext<T> tokenContext, String tokenId)
			throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(ENCRYPTION_KEY_ALGORITHM, keyStore.getProvider());

		String keyAlias = keystoreAliasFactory.getEncryptionKeyAlias(tokenContext.getId(), tokenId);

		KeyGenParameterSpec.Builder specBuilder = new KeyGenParameterSpec.Builder(keyAlias, KeyProperties.PURPOSE_DECRYPT)
				.setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
				.setKeySize(ENCRYPTION_KEY_SIZE);
		keyPairGenerator.initialize(specBuilder.build());

		return keyPairGenerator.generateKeyPair();
	}

	@RequiresApi(Build.VERSION_CODES.N)
	protected KeyPair generateSignatureKeyPair(TokenContext<T> tokenContext, String tokenId, byte[] attestationChallenge)
			throws InvalidAlgorithmParameterException, NoSuchAlgorithmException {
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(TOKEN_KEY_ALGORITHM, keyStore.getProvider());

		String keyAlias = keystoreAliasFactory.getSignatureKeyAlias(tokenContext.getId(), tokenId);

		KeyGenParameterSpec.Builder specBuilder = new KeyGenParameterSpec.Builder(keyAlias, KeyProperties.PURPOSE_SIGN)
				.setAlgorithmParameterSpec(new ECGenParameterSpec(TOKEN_KEY_KEYGEN_SPEC))
				.setDigests(KeyProperties.DIGEST_SHA256);
		specBuilder.setAttestationChallenge(attestationChallenge);

		keyPairGenerator.initialize(specBuilder.build());

		return keyPairGenerator.generateKeyPair();
	}

	@Deprecated
	protected KeyPair generateSignatureKeyPair(TokenContext<T> tokenContext, String tokenId) throws TokenKeystoreException {
		try {
			KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(TOKEN_KEY_ALGORITHM, keyStore.getProvider());

			String keyAlias = keystoreAliasFactory.getSignatureKeyAlias(tokenContext.getId(), tokenId);

			KeyGenParameterSpec.Builder specBuilder = new KeyGenParameterSpec.Builder(keyAlias, KeyProperties.PURPOSE_SIGN)
					.setAlgorithmParameterSpec(new ECGenParameterSpec(TOKEN_KEY_KEYGEN_SPEC))
					.setDigests(KeyProperties.DIGEST_SHA256);

			keyPairGenerator.initialize(specBuilder.build());

			return keyPairGenerator.generateKeyPair();
		} catch (Exception e) {
			throw new TokenKeystoreException("Failed to generate token keypair", e);
		}
	}

	protected List<byte[]> getEncryptionEncodedCertificateChain(TokenContext<T> tokenContext, String tokenId) throws TokenTrustChainExceptionToken {
		String keyAlias = keystoreAliasFactory.getEncryptionKeyAlias(tokenContext.getId(), tokenId);

		return getEncodedCertificateChain(keyAlias);
	}

	protected List<byte[]> getSignatureEncodedCertificateChain(TokenContext<T> tokenContext, String tokenId) throws TokenTrustChainExceptionToken {
		String keyAlias = keystoreAliasFactory.getSignatureKeyAlias(tokenContext.getId(), tokenId);

		return getEncodedCertificateChain(keyAlias);
	}

	protected List<byte[]> getEncodedCertificateChain(String alias) throws TokenTrustChainExceptionToken {
		try {

			List<byte[]> encodedCertificateChain = new ArrayList<>();
			Certificate[] certificateChain = keyStore.getCertificateChain(alias);

			if (certificateChain != null) {
				for (Certificate certificate : certificateChain) {
					encodedCertificateChain.add(certificate.getEncoded());
				}
			}
			return encodedCertificateChain;
		} catch (Exception e) {
			throw new TokenTrustChainExceptionToken("Failed to read certificate chain for " + alias, e);
		}

	}

	protected PrivateKey loadPrivateKey(String alias) throws KeyStoreException, UnrecoverableEntryException, NoSuchAlgorithmException {
		Log.d(TAG, "Load private key for " + alias);

		PrivateKey privateKey;
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
			privateKey = (PrivateKey) keyStore.getKey(alias, null);
		} else {
			KeyStore.PrivateKeyEntry entry = (KeyStore.PrivateKeyEntry) keyStore.getEntry(alias, null);
			if (entry != null) {
				privateKey = entry.getPrivateKey();
			} else {
				privateKey = null;
			}
		}

		if (privateKey == null) {
			Log.w(TAG, "No private key for " + alias);
		}

		return privateKey;
	}

	/**
	 *
	 * Note: This stores the certificate alongside the private key. The certificate is really not secret, so it could also be stored elsewhere outside the key
	 * store. The key issue is that it can be retrieved and presented later (when the private key is used).
	 *
	 * @param tokenContext token context
	 * @param tokenId      token id
	 * @param key          private key
	 * @param certificate  certificate to se
	 * @throws KeyStoreException
	 * @throws TokenKeystoreException
	 */

	@Override
	public void setSignatureCertificate(TokenContext<T> tokenContext, String tokenId, PrivateKey key, Certificate certificate)
			throws KeyStoreException, TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					String keyAlias = keystoreAliasFactory.getSignatureKeyAlias(tokenContext.getId(), tokenId);

					Log.d(TAG, "Set signature certificate for " + tokenId);

					keyStore.setKeyEntry(keyAlias, key, null, new Certificate[] { certificate });
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@Override
	public Certificate getSignatureCertificate(TokenContext<T> tokenContext, String tokenId) throws KeyStoreException, TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					String keyAlias = keystoreAliasFactory.getSignatureKeyAlias(tokenContext.getId(), tokenId);

					return getCertificate(keyAlias);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}

	}

	@Override
	public Certificate getEncryptionCertificate(TokenContext<T> tokenContext, String tokenId) throws KeyStoreException, TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					String keyAlias = keystoreAliasFactory.getEncryptionKeyAlias(tokenContext.getId(), tokenId);

					return getCertificate(keyAlias);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	private Certificate getCertificate(String alias) throws KeyStoreException {
		return keyStore.getCertificate(alias);
	}

	@Override
	public PrivateKey getSignaturePrivateKey(TokenContext<T> tokenContext, String tokenId)
			throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException, TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					String keyAlias = keystoreAliasFactory.getSignatureKeyAlias(tokenContext.getId(), tokenId);
					return loadPrivateKey(keyAlias);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	@Override
	public PrivateKey getEncryptionPrivateKey(TokenContext<T> tokenContext, String tokenId)
			throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException, TokenKeystoreException {
		try {
			if (lock.tryLock(lockTimeout, TimeUnit.MILLISECONDS)) {
				try {
					String keyAlias = keystoreAliasFactory.getEncryptionKeyAlias(tokenContext.getId(), tokenId);
					return loadPrivateKey(keyAlias);
				} finally {
					lock.unlock();
				}
			} else {
				throw exceptionLockTimeout();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenKeystoreException(e);
		}
	}

	protected KeystoreAliasFactory getKeystoreAliasFactory() {
		return keystoreAliasFactory;
	}

	private TokenKeystoreException exceptionLockTimeout() {
		return new TokenKeystoreException("Timeout waiting " + lockTimeout + " ms for keystore");
	}
}
