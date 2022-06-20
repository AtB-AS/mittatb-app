package no.entur.abt.android.bluetooth.format;

import java.security.Signature;
import java.security.SignatureException;
import java.util.Arrays;

public class ChallengeSigner implements ChallengeBinarySerializer {

	private final Signature signature;
	private final ChallengeBinarySerializer[] serializers;

	// in prioritized order
	public ChallengeSigner(Signature signature, ChallengeBinarySerializer... serializer) {
		this.signature = signature;
		this.serializers = serializer;
	}

	@Override
	public byte[] serialize(Challenge challenge) {
		try {
			byte[] serialize = serializeFormat(challenge);

			byte[] sign;
			synchronized (signature) {
				signature.update(serialize);
				sign = signature.sign(); // also resets
			}

			byte[] result = new byte[serialize.length + sign.length];
			System.arraycopy(serialize, 0, result, 0, serialize.length);
			System.arraycopy(sign, 0, result, serialize.length, sign.length);

			return result;
		} catch (SignatureException e) {
			throw new RuntimeException(e);
		}
	}

	private byte[] serializeFormat(Challenge challenge) {
		for (ChallengeBinarySerializer serializer : serializers) {
			if (serializer.supports(challenge)) {
				return serializer.serialize(challenge);
			}
		}
		throw new IllegalArgumentException(challenge.getClass().getName() + " " + Arrays.asList(serializers));
	}

	@Override
	public boolean supports(Challenge challenge) {
		for (ChallengeBinarySerializer serializer : serializers) {
			if (serializer.supports(challenge)) {
				return true;
			}
		}
		return false;
	}
}
