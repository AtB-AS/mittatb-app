package no.entur.abt.android.bluetooth.format;

public interface ChallengeBinarySerializer {

	boolean supports(Challenge challenge);

	byte[] serialize(Challenge challenge);
}
