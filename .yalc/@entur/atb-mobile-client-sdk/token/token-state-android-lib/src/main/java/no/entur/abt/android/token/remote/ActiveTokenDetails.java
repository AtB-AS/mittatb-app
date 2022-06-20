package no.entur.abt.android.token.remote;

import java.time.Instant;

public class ActiveTokenDetails {

	private final byte[] certificate;
	private final Instant validityStart;
	private final Instant validityEnd;

	public ActiveTokenDetails(byte[] certificate, Instant validityStart, Instant validityEnd) {
		this.certificate = certificate;
		this.validityStart = validityStart;
		this.validityEnd = validityEnd;
	}

	public byte[] getSignatureCertificate() {
		return certificate;
	}

	public Instant getValidityEnd() {
		return validityEnd;
	}

	public Instant getValidityStart() {
		return validityStart;
	}
}
