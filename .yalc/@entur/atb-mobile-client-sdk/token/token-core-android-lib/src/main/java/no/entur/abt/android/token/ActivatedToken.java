package no.entur.abt.android.token;

import java.security.KeyPair;
import java.security.cert.Certificate;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.TemporalUnit;

public class ActivatedToken<T> extends Token<T> {

	protected static final String TAG = ActivatedToken.class.getName();

	protected final Certificate signatureCertificate;
	protected final Certificate encryptionCertificate;
	protected Instant validityStart;
	protected Instant validityEnd;

	protected final Clock clock;

	protected volatile Token<T> renewToken;
	protected volatile boolean invalidated = false;

	public ActivatedToken(String tokenId, Instant validityStart, Instant validityEnd, KeyPair signatureKey, KeyPair encryptKey,
			Certificate signatureCertificate, Certificate encryptionCertificate, TokenEncoder tokenEncoder, Clock clock, int strainNumber,
			TokenContext<T> tokenContext) {
		super(tokenId, signatureKey, encryptKey, tokenEncoder, strainNumber, tokenContext);
		this.validityStart = validityStart;
		this.validityEnd = validityEnd;
		this.signatureCertificate = signatureCertificate;
		this.encryptionCertificate = encryptionCertificate;
		this.clock = clock;
	}

	public Instant getValidityEnd() {
		return validityEnd;
	}

	public Instant getValidityStart() {
		return validityStart;
	}

	public boolean isEnded() {
		return isEnded(clock.instant());
	}

	public boolean isStarted() {
		return isStarted(clock.instant());
	}

	public Duration getDurationToStarted() {
		if (validityStart == null) {
			return null;
		}
		Instant now = clock.instant();
		if (now.isBefore(validityStart)) {
			return Duration.between(now, validityStart);
		}
		return null;
	}

	protected boolean isEnded(Instant instant) {
		return instant.isAfter(validityEnd);
	}

	protected boolean isStarted(Instant instant) {
		return validityStart.isBefore(instant);
	}

	public Certificate getSignatureCertificate() {
		return signatureCertificate;
	}

	public Certificate getEncryptionCertificate() {
		return encryptionCertificate;
	}

	protected boolean isTokenValid() {
		return isTokenValid(clock.instant());
	}

	protected boolean isTokenValid(Instant instant) {
		if (!isStarted(instant)) {
			return false;
		}
		if (isEnded(instant)) {
			return false;
		}
		return true;
	}

	public boolean isTokenEnded(Instant instant) {
		return instant.isAfter(validityEnd);
	}

	public boolean willEndInLessThan(long amount, TemporalUnit unit) {
		// if the token expires in a few hours, it should be renewed
		return isTokenEnded(clock.instant().plus(amount, unit));
	}

	public long getExpires() {
		return getValidityEnd().toEpochMilli();
	}

	public long getTimeToLiveMillis() {
		return validityEnd.toEpochMilli() - validityStart.toEpochMilli();
	}

	// TODO protected access?
	public void setRenewToken(Token<T> renewToken) {
		this.renewToken = renewToken;
	}

	public Token<T> getRenewToken() {
		return renewToken;
	}

	public boolean hasRenewToken() {
		return renewToken != null;
	}

	public void markMustBeRenewed() {
		this.invalidated = true;
	}

	public boolean mustBeRenewed() {
		return invalidated;
	}

	public ActivatedToken<T> forward() {
		ActivatedToken<T> activatedToken = this;
		// fast forward if the token has been renewed since last time
		while (activatedToken.getRenewToken() instanceof ActivatedToken) {
			activatedToken = (ActivatedToken<T>) activatedToken.getRenewToken();
		}

		return activatedToken;
	}

}
