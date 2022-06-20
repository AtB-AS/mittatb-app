package no.entur.abt.android.bluetooth.format;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Provider;
import java.security.PublicKey;
import java.security.Signature;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ChallengeVerifier {

	public static final String SIGNATURE_ALGORITHM = "SHA256withECDSA";

	private static final String TAG = ChallengeVerifier.class.getName();

	public static Builder newBuilder() {
		return new Builder();
	}

	public static class Builder {

		private Clock clock;
		private List<PublicKey> publicKeys;
		private List<ChallengeBinaryParser> parsers;
		private Integer transport;
		private Provider provider;

		public Builder withProvider(Provider provider) {
			this.provider = provider;
			return this;
		}

		public Builder withPublicKeys(List<PublicKey> publicKeys) {
			this.publicKeys = publicKeys;
			return this;
		}

		public Builder withClock(Clock clock) {
			this.clock = clock;
			return this;
		}

		/**
		 * Set the transport type. Note that ANY-type challenges also will be accepted.
		 *
		 * @param transport transport code
		 * @return this builder
		 */

		public Builder withTransport(int transport) {
			this.transport = transport;
			return this;
		}

		public Builder withParsers(ChallengeBinaryParser... parsers) {
			return withParsers(Arrays.asList(parsers));
		}

		public Builder withParsers(List<ChallengeBinaryParser> parsers) {
			this.parsers = parsers;

			return this;
		}

		public ChallengeVerifier build() {
			if (clock == null) {
				throw new IllegalStateException();
			}
			if (publicKeys == null) {
				throw new IllegalStateException();
			}
			if (parsers == null || parsers.isEmpty()) {
				throw new IllegalStateException();
			}
			if (transport == null) {
				throw new IllegalStateException();
			}

			List<Signature> signatures = new ArrayList<>();

			for (PublicKey publicKey : publicKeys) {
				try {
					Signature verifySignature;
					if (provider != null) {
						verifySignature = Signature.getInstance(SIGNATURE_ALGORITHM, provider);
					} else {
						verifySignature = Signature.getInstance(SIGNATURE_ALGORITHM);
					}
					verifySignature.initVerify(publicKey);
					signatures.add(verifySignature);
				} catch (InvalidKeyException | NoSuchAlgorithmException e) {
					// ignore
				}
			}

			return new ChallengeVerifier(signatures, parsers, clock, transport);
		}
	}

	private final Signature[] signatures;
	private final ChallengeBinaryParser[] parsers;
	private final Clock clock;
	private final int transport;

	protected ChallengeVerifier(List<Signature> signatures, List<ChallengeBinaryParser> parsers, Clock clock, int transport) {
		this.signatures = signatures.toArray(new Signature[signatures.size()]);
		this.parsers = parsers.toArray(new ChallengeBinaryParser[parsers.size()]);
		this.clock = clock;
		this.transport = transport;
	}

	public List<ChallengeBinaryParser> getParsers(byte[] bytes) {
		List<ChallengeBinaryParser> supported = new ArrayList<>();
		for (ChallengeBinaryParser parser : parsers) {
			if (parser.supports(bytes)) {
				supported.add(parser);
			}
		}
		return supported;
	}

	public Challenge verify(byte[] bytes) {
		return verify(bytes, getParsers(bytes));
	}

	// assume all parsers support the format
	public Challenge verify(byte[] bytes, List<ChallengeBinaryParser> parsers) {
		Instant now = clock.instant();

		for (ChallengeBinaryParser parser : parsers) {
			// take the signature as 'the rest' of the message
			// so we don't need a dedicated field for the signature length
			int length = parser.getLength(bytes);

			for (Signature signature : signatures) {
				try {
					boolean verified;
					synchronized (signature) {
						signature.update(bytes, 0, length);

						// note: this also resets the signature
						verified = signature.verify(bytes, length, bytes.length - length);
					}
					if (verified) {
						Challenge parsed = parser.parse(bytes);
						if (verifyTransport(parsed)) {
							if (parsed.getValidToTime().isAfter(now)) {
								// valid
								return parsed;
							} else {
								// report spoofing attempt?
								break;
							}
						}
					}
				} catch (Exception e) {
					// ignore
				}
			}
		}

		return null;
	}

	private boolean verifyTransport(Challenge parsed) {
		if (parsed.getTransport() == Challenge.TRANSPORT_ANY) {
			return true;
		}
		return parsed.getTransport() == transport;
	}

	public boolean hasSignatures() {
		return signatures.length > 0;
	}

	public Signature[] getSignatures() {
		return signatures;
	}
}
