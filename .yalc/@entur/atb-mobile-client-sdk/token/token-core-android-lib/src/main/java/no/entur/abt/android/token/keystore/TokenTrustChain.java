package no.entur.abt.android.token.keystore;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Collections;
import java.util.List;

public class TokenTrustChain {

	private final KeyPair keyPair;
	private final List<byte[]> certificateChain;

	public TokenTrustChain(KeyPair keyPair) {
		this(keyPair, Collections.emptyList());
	}

	public TokenTrustChain(KeyPair keyPair, List<byte[]> certificateChain) {
		this.keyPair = keyPair;
		this.certificateChain = certificateChain;
	}

	public KeyPair getKeyPair() {
		return keyPair;
	}

	public List<byte[]> getCertificateChain() {
		return certificateChain;
	}

	public PrivateKey getPrivate() {
		return getKeyPair().getPrivate();
	}

	public PublicKey getPublic() {
		return getKeyPair().getPublic();
	}

	public byte[] getPublicEncoded() {
		return getPublic().getEncoded();
	}
}
