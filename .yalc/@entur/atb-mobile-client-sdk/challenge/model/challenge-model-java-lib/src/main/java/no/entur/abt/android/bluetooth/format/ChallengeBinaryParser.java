package no.entur.abt.android.bluetooth.format;

/**
 *
 * Challenge binary parser.
 *
 * Note that this indirectly adds some requirements to the format itself: <br>
 * <br>
 * - must be able to identify format - must be able to extract the length of the challenge format (from a variable sized byte array). This is important so that
 * extracting the signature part of the challenge is possible. <br>
 */

public interface ChallengeBinaryParser {

	Challenge parse(byte[] content);

	boolean supports(byte[] content);

	int getLength(byte[] content);
}
