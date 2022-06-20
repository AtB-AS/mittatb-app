package no.entur.abt.android.bluetooth.format;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;

/**
 *
 * SHA256withECDSA ANS1 size is 6 + r + s. - (vr) is the signed big-endian encoding of the value "r", of minimal length; - (vs) is the signed big-endian
 * encoding of the value "s", of minimal length.
 *
 * https://stackoverflow.com/questions/30175149/error-when-verifying-ecdsa-signature-in-java-with-bouncycastle
 *
 * https://crypto.stackexchange.com/questions/1795/how-can-i-convert-a-der-ecdsa-signature-to-asn-1
 */

public class ChallengeVerifierTest extends AbstractChallengeTest {

	/**
	 *
	 * Test multiple signatures and formats.
	 *
	 */

	@Test
	public void testVerifier() throws Exception {
		Challenge challenge = builder.build();
		int length = 32;
		Pair pair = getPair(length);

		ChallengeVerifier verifier = pair.getVerifier(); // using all certificates
		for (int k = 0; k < length; k++) {

			// i.e. a single signature, but with multiple challenge formats
			ChallengeSigner challengeSigner = pair.getSigners().get(k);

			byte[] serialize = challengeSigner.serialize(challenge);
			byte[] payload = format.serialize(challenge);

			int signatureLength = serialize.length - format.getLength(serialize);
			assertEquals(signatureLength + payload.length, serialize.length);
			for (int i = 0; i < payload.length; i++) {
				assertEquals(payload[i], serialize[i]);
			}

			Challenge restore = verifier.verify(serialize);

			assertEquals(challenge, restore);

			if (serialize.length > 4 * 23) {
				throw new IllegalStateException();
			}

			// check dummy value too
			DummyChallenge dummyChallenge = new DummyChallenge(1, Duration.ZERO, false, new byte[] { 0, 1, 0, 1, 0, 1, 0, 1 }, Instant.now(),
					Instant.now().plus(1, ChronoUnit.HOURS), 0);
			byte[] dummySerialize = challengeSigner.serialize(dummyChallenge);

			Challenge dummyRestored = verifier.verify(dummySerialize);
			assertTrue(dummyRestored instanceof DummyChallenge);
		}

		// test invalid signature 1
		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		bout.write(format.serialize(challenge));
		bout.write(new byte[72]);
		assertNull(verifier.verify(bout.toByteArray()));

		// test invalid signature 2 - change one of the digits
		byte[] serialize = pair.getSigners().get(0).serialize(challenge);
		serialize[serialize.length - 4] = (byte) (~serialize[serialize.length - 4] & 0xFF);
		assertNull(verifier.verify(serialize));

	}

}
