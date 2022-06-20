package no.entur.abt.android.common.visual.model;

/*-
 * #%L
 * Visual Inspection lib for android
 * %%
 * Copyright (C) 2019 Entur AS and original authors
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.BitSet;
import java.util.Random;

import org.junit.jupiter.api.Test;

public class VisualCodeTest {

	@Test
	public void testSameInputProducesSameVisualCode() throws InvalidVisualCodeException {

		VisualCodeStatistics statistics = new VisualCodeStatistics(1);

		for (int i = 0; i < 100000; i++) {
			byte[] challenge = new byte[128];
			new Random().nextBytes(challenge);

			InvertableVisualCode ivc1 = InvertableVisualCode.create(challenge);
			InvertableVisualCode ivc2 = InvertableVisualCode.create(challenge);

			statistics.add(ivc1.getCurrent());
			assertVisualCodeEquals(ivc1.getCurrent(), ivc2.getCurrent());

			ivc1.invertedView();

			statistics.add(ivc1.getCurrent());
			assertNotEquals(ivc1.getCurrent(), ivc2.getCurrent());

			ivc2.invertedView();

			assertVisualCodeEquals(ivc1.getCurrent(), ivc2.getCurrent());
		}
	}

	@Test
	public void testUniformDistribution() throws InvalidVisualCodeException {

		VisualCodeStatistics statistics = new VisualCodeStatistics(1);

		for (int i = 0; i < 10000000; i++) {
			byte[] challenge = new byte[128];
			new Random().nextBytes(challenge);

			InvertableVisualCode ivc1 = InvertableVisualCode.create(challenge);

			statistics.add(ivc1.getCurrent());
			ivc1.invertedView();
			statistics.add(ivc1.getCurrent());
		}

		statistics.assertUniformShapeDistribution();
		statistics.assertUniformShapePositionExceptFromCenter();
		statistics.assertUniformShapeColorDistribution();
		statistics.assertUniformForegroundColorDistribution();
		statistics.assertUniformBackgroundColorDistribution();
		statistics.assertUniformBackgroundPatternDistribution();
	}

	@Test
	public void testSegments() throws InvalidVisualCodeException {
		// internally represented as
		// 00000000 10000000 01000000 11000000 00100000 101000000 1100000 11100000
		// aka little endian (least significant digits first)
		byte[] values = new byte[] { 0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07 };

		int[] segments = VisualCode.splitIntoSegments(values, values.length);
		assertEquals(segments.length, values.length);

		for (int i = 0; i < values.length; i++) {
			// i.e. each byte is flipped, then read from the other side
			// so the number is still the same
			assertEquals(segments[i], i);
		}
	}

	@Test
	public void testSegments2() throws InvalidVisualCodeException {
		byte[] values = new byte[] { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07 };

		int[] segments = VisualCode.splitIntoSegments(values, values.length * 2);
		assertEquals(segments.length, values.length * 2);

		for (int i = 0; i < values.length; i++) {
			// i.e. each byte was flipped, then read from the direction little -> big direction
			// so the numbers are the same but 0 is first
			assertEquals(segments[i * 2], i);
			assertEquals(segments[i * 2 + 1], 0);
		}
	}

	private void assertVisualCodeEquals(VisualCode vc1, VisualCode vc2) {
		assertEquals(vc1.getBackgroundPattern(), vc2.getBackgroundPattern());
		assertEquals(vc1.getPrimaryBackgroundColor(), vc2.getPrimaryBackgroundColor());
		assertEquals(vc1.getSecondaryBackgroundColor(), vc2.getSecondaryBackgroundColor());
		assertEquals(vc1.getShapes(), vc2.getShapes());
	}

	@Test
	public void testBitSet() {
		byte[] bytes = new byte[Byte.MAX_VALUE - Byte.MIN_VALUE + 1];
		for (byte i = Byte.MIN_VALUE; i < Byte.MAX_VALUE; i++) {
			bytes[-Byte.MIN_VALUE + i] = i;
		}

		BitSet figureBasisBits = BitSet.valueOf(bytes);

		for (int i = 0; i < bytes.length; i++) {
			assertEquals(figureBasisBits.get(i), VisualCode.isBit(i, bytes));
		}
	}

	@Test
	public void testSerialier() throws IOException, NoSuchAlgorithmException {

		byte[] values = new byte[] { 0, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07 };

		VisualCodeSerializer serializer = new VisualCodeSerializer();
		String serialize = serializer.serialize(values);

		System.out.println(serialize);
	}

	@Test
	public void testTrace() {

		byte[] decode = Base64.getDecoder().decode("AAECAwQFBgc=");

		InvertableVisualCode invertableVisualCode = InvertableVisualCode.create(decode);

	}

}
