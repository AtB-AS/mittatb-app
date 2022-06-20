package no.entur.abt.android.bluetooth.format;

import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.spec.ECGenParameterSpec;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.junit.jupiter.api.BeforeEach;

import no.entur.abt.android.bluetooth.format.v1.ChallengeBinaryFormat;

public abstract class AbstractChallengeTest {

	protected Clock clock = Clock.systemDefaultZone();

	protected ChallengeBinaryFormat format = new ChallengeBinaryFormat();
	protected DummyChallengeBinaryFormat dummyFormat = new DummyChallengeBinaryFormat();

	protected no.entur.abt.android.bluetooth.format.Challenge.Builder builder;

	private final BouncyCastleProvider bcProvider = new BouncyCastleProvider();

	@BeforeEach
	public void init() {
		Instant now = clock.instant().truncatedTo(ChronoUnit.SECONDS);

		builder = Challenge.newBuilder()
				.withClientId((short) 123)
				.withDelay(Duration.ofMinutes(20))
				.withSelfInspect(true)
				.withNonce(new byte[] { 0, 1, 2, 3, 4, 5, 6, 7 })
				.withTransport(0)
				.withValidToTime(now.plus(30, ChronoUnit.MINUTES));
	}

	public static class Pair {
		private List<ChallengeSigner> signers;
		private ChallengeVerifier verifier;

		public Pair(List<ChallengeSigner> signers, ChallengeVerifier verifier) {
			this.signers = signers;
			this.verifier = verifier;
		}

		public ChallengeVerifier getVerifier() {
			return verifier;
		}

		public List<ChallengeSigner> getSigners() {
			return signers;
		}
	}

	public Pair getPair(int keys) throws Exception {
		List<ChallengeSigner> signers = new ArrayList<>();
		List<PublicKey> publicKeys = new ArrayList<>();

		for (int i = 0; i < keys; i++) {
			KeyPair keypair = generateKeyPair();

			Signature signSignature = Signature.getInstance(ChallengeVerifier.SIGNATURE_ALGORITHM, bcProvider);
			signSignature.initSign(keypair.getPrivate());
			signers.add(new ChallengeSigner(signSignature, dummyFormat, format));

			publicKeys.add(keypair.getPublic());
		}

		ChallengeVerifier verifier = ChallengeVerifier.newBuilder()
				.withParsers(dummyFormat, format)
				.withPublicKeys(publicKeys)
				.withClock(clock)
				.withTransport(Challenge.TRANSPORT_BLUETOOTH_BROADCAST)
				.withProvider(bcProvider)
				.build();

		return new Pair(signers, verifier);
	}

	private KeyPair generateKeyPair() throws NoSuchAlgorithmException, InvalidAlgorithmParameterException {
		ECGenParameterSpec ecSpec = new ECGenParameterSpec("secp256r1");
		KeyPairGenerator g = KeyPairGenerator.getInstance("EC");
		g.initialize(ecSpec, new SecureRandom());
		return g.generateKeyPair();
	}
}
