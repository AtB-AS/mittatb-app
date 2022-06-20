package no.entur.abt.android.token.remote;

public class PendingTokenDetails {

	private final String tokenId;
	private final byte[] nonce;

	public PendingTokenDetails(String tokenId, byte[] nonce) {
		this.tokenId = tokenId;
		this.nonce = nonce;
	}

	public byte[] getNonce() {
		return nonce;
	}

	public String getTokenId() {
		return tokenId;
	}
}
