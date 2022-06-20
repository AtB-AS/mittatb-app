package no.entur.abt.android.common.pki;

import java.io.File;
import java.security.Provider;
import java.security.PublicKey;
import java.util.List;

/**
 * 
 * TODO would it be better to split this into two classes? Should the traveller do its own validation of certificates?
 * 
 */

public class GCSCachingPublicKeyRepository implements PublicKeyRepository {

	private static final String INSPECTION_CHALLENGE_BUCKET_FOLDER = "CONTROL_CHALLENGE/";
	private static final String TOKEN_BUCKET_FOLDER = "TOKEN/";
	private static final String PUBLIC_KEYS_FOLDER = "PUBLIC_KEYS";

	private static final String INSPECTION_CHALLENGE_FOLDER = INSPECTION_CHALLENGE_BUCKET_FOLDER + File.pathSeparator + PUBLIC_KEYS_FOLDER;
	private static final String TOKEN_FOLDER = TOKEN_BUCKET_FOLDER + File.pathSeparator + PUBLIC_KEYS_FOLDER;

	private final RawPublicKeyLocalRepository tokenPublicKeys;
	private final RawPublicKeyLocalRepository controlChallengePublicKeys;

	private final String publicKeysBucketName;

	public GCSCachingPublicKeyRepository(File path, String publicKeysBucketName, Provider provider, String baseDirectory,
			RawPublicKeyLocalRepository.Listener listener) {
		this.publicKeysBucketName = publicKeysBucketName;
		// add bucket name to path, so to prevent race conditions if the repo is updated
		// (possibly deleting old keys while simultaneously updating them).
		BucketPublicKeyFileRepository challengeBucket = new BucketPublicKeyFileRepository(publicKeysBucketName, INSPECTION_CHALLENGE_BUCKET_FOLDER);

		String controlChallengePath = baseDirectory + File.pathSeparator + publicKeysBucketName + File.pathSeparator + INSPECTION_CHALLENGE_FOLDER;
		controlChallengePublicKeys = new RawPublicKeyLocalRepository(path, "inspection challenge", controlChallengePath, challengeBucket, provider, listener);

		BucketPublicKeyFileRepository tokenBucket = new BucketPublicKeyFileRepository(publicKeysBucketName, TOKEN_BUCKET_FOLDER);
		String tokenPath = baseDirectory + File.pathSeparator + publicKeysBucketName + File.pathSeparator + TOKEN_FOLDER;

		tokenPublicKeys = new RawPublicKeyLocalRepository(path, "token", tokenPath, tokenBucket, provider, listener);
	}

	@Override
	public boolean updateKeys(PublicKeyType publicKeyType) {
		switch (publicKeyType) {
		case TOKEN_VERIFICATION: {
			return tokenPublicKeys.updatePublicKeys();
		}
		case CHALLENGE_VERIFICATION: {
			return controlChallengePublicKeys.updatePublicKeys();
		}
		default: {
			throw new IllegalArgumentException("Unexpected public key type " + publicKeyType);
		}
		}
	}

	@Override
	public List<PublicKey> getPublicKeys(PublicKeyType publicKeyType) {
		switch (publicKeyType) {
		case TOKEN_VERIFICATION:
			return tokenPublicKeys.getPublicKeys();
		case CHALLENGE_VERIFICATION:
			return controlChallengePublicKeys.getPublicKeys();
		default: {
			throw new IllegalArgumentException("Unknown public key type " + publicKeyType);
		}
		}
	}

	public String getId() {
		return publicKeysBucketName;
	}

	@Override
	public void deleteKeys() {
		tokenPublicKeys.deletePublicKeysFromFolder();
		controlChallengePublicKeys.deletePublicKeysFromFolder();
	}
}
