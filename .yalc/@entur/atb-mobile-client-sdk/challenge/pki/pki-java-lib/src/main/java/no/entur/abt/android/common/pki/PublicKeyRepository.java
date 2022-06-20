package no.entur.abt.android.common.pki;

import java.security.PublicKey;
import java.util.List;

public interface PublicKeyRepository {

	enum PublicKeyType {
		TOKEN_VERIFICATION,
		CHALLENGE_VERIFICATION
	}

	// To be run at least every 24 hours
	boolean updateKeys(PublicKeyType publicKeyType);

	List<PublicKey> getPublicKeys(PublicKeyType publicKeyType);

	String getId();

	void deleteKeys();
}
