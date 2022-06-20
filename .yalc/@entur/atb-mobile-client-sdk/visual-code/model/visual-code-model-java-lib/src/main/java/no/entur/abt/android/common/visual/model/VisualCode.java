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
package no.entur.abt.android.common.visual.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Immutable representation of geometrical shapes in different colors generated from random byte arrays. To be used for verifying matching secrets at a glance.
 */
public class VisualCode {

	private static final List<VisualCodeColor> COLORS = VisualCodeColor.listByIndex();
	private static final List<VisualCodeShapeType> SHAPE_TYPES = VisualCodeShapeType.listByIndex();
	private static final List<VisualCodePatternType> PATTERN_TYPES = VisualCodePatternType.listByIndex();
	private static final VisualCodeShapePosition[] POSITIONS = VisualCodeShapePosition.values();
	private static final int MAX_NUM_SHAPES = 4;

	private static final int BACKGROUND_COLOR_PRIMARY_SEGMENT_INDEX = 0;
	private static final int BACKGROUND_COLOR_SECONDARY_SEGMENT_INDEX = 1;
	private static final int BACKGROUND_PATTERN_SEGMENT_INDEX = 2;
	private static final int SHAPES_POSITION_SEGMENT_INDEX = 3;
	private static final int SHAPES_COLORS_SEGMENT_INDEX_OFFSET = 4;
	private static final int SHAPES_TYPE_SEGMENT_INDEX_OFFSET = SHAPES_COLORS_SEGMENT_INDEX_OFFSET + MAX_NUM_SHAPES;
	private static final int NUM_SEGMENTS = SHAPES_TYPE_SEGMENT_INDEX_OFFSET + MAX_NUM_SHAPES;
	private static final int MIN_BITS_PER_SEGMENT = 4;

	private final byte[] figureBasis;

	private int frameColor = 0; // transparent
	private boolean frame;

	private final VisualCodeColor primaryBackgroundColor;
	private final VisualCodeColor secondaryBackgroundColor;
	private final VisualCodePatternType backgroundPattern;

	private final List<VisualCodeShape> shapes;

	protected VisualCode(byte[] figureBasis) throws InvalidVisualCodeException {
		this.figureBasis = figureBasis;

		int[] segments = splitIntoSegments(figureBasis, NUM_SEGMENTS);
		List<VisualCodeColor> remainingColors = new ArrayList<>(COLORS);

		// Get colors for background, and make it so that the selected colors
		// are not reused in the shapes
		primaryBackgroundColor = getExclusiveColor(segments[BACKGROUND_COLOR_PRIMARY_SEGMENT_INDEX], remainingColors);
		secondaryBackgroundColor = getExclusiveColor(segments[BACKGROUND_COLOR_SECONDARY_SEGMENT_INDEX], remainingColors);
		backgroundPattern = getPattern(segments[BACKGROUND_PATTERN_SEGMENT_INDEX]);

		List<VisualCodeShape> visualCodeShapeshapes = new ArrayList<>(4);

		List<VisualCodeShapePosition> positions = getShapePositions(segments[SHAPES_POSITION_SEGMENT_INDEX]);
		for (int i = 0; i < positions.size(); i++) {
			VisualCodeShapePosition shapePosition = positions.get(i);

			VisualCodeColor shapeColor = getColor(segments[SHAPES_COLORS_SEGMENT_INDEX_OFFSET + i], remainingColors);
			VisualCodeShapeType shapeType = getShapeType(segments[SHAPES_TYPE_SEGMENT_INDEX_OFFSET + i]);

			visualCodeShapeshapes.add(new VisualCodeShape(shapeType, shapePosition, shapeColor));
		}

		this.shapes = Collections.unmodifiableList(visualCodeShapeshapes);
	}

	public List<VisualCodeShape> getShapes() {
		return shapes;
	}

	public VisualCodeColor getPrimaryBackgroundColor() {
		return primaryBackgroundColor;
	}

	public VisualCodeColor getSecondaryBackgroundColor() {
		return secondaryBackgroundColor;
	}

	public VisualCodePatternType getBackgroundPattern() {
		return backgroundPattern;
	}

	public int getFrameColor() {
		return frameColor;
	}

	private static VisualCodeShapeType getShapeType(int typeHash) {
		return SHAPE_TYPES.get(computeValue(typeHash, SHAPE_TYPES.size()));
	}

	private static VisualCodePatternType getPattern(int typeHash) {
		return PATTERN_TYPES.get(computeValue(typeHash, PATTERN_TYPES.size()));
	}

	private static List<VisualCodeShapePosition> getShapePositions(int positionHash) {
		List<VisualCodeShapePosition> positions = new ArrayList<>(4);

		for (VisualCodeShapePosition position : POSITIONS) {
			if (position.isMask(positionHash)) {
				positions.add(position);
			}
		}

		if (positions.isEmpty()) {
			positions.add(VisualCodeShapePosition.CENTER);
		}

		return positions;
	}

	private static VisualCodeColor getExclusiveColor(int colorHash, List<VisualCodeColor> remainingColors) {
		VisualCodeColor color = getColor(colorHash, remainingColors);
		remainingColors.remove(color);
		return color;
	}

	private static VisualCodeColor getColor(int colorHash, List<VisualCodeColor> remainingColors) {
		return remainingColors.get(computeValue(colorHash, remainingColors.size()));
	}

	/*
	 * Convert the byte array into a stream of bits and allocate an equal number of bits into each segment. If the number of bits is not a multiple of number of
	 * segments, the remainder is discarded.
	 */
	protected static int[] splitIntoSegments(byte[] figureBasis, int numSegments) throws InvalidVisualCodeException {

		// Number of bits per part
		int numberOfBits = figureBasis.length * 8;
		int bitsPerSegment = (figureBasis.length * 8) / numSegments;

		if (bitsPerSegment < MIN_BITS_PER_SEGMENT) {
			throw new InvalidVisualCodeException(
					String.format("Too many segments %d for this figure basis of length %d, bits per part would be %d which is less than minimum value of %d",
							numSegments, numberOfBits, bitsPerSegment, MIN_BITS_PER_SEGMENT));
		} else if (bitsPerSegment > 31) {
			throw new InvalidVisualCodeException(
					String.format("Number of bits per segment in figure basis is %d and too high for this algorithm max %d", bitsPerSegment, 31));
		}

		int[] segments = new int[numSegments];
		for (int i = 0; i < numSegments; i++) {
			// Since max 31 bits are included, the integer is always
			// a positive value (the sign bit is bit number 32)
			int bitInteger = 0;

			int offset = bitsPerSegment * i;
			for (int k = 0; k < bitsPerSegment; k++) {
				if (isBit(offset + k, figureBasis)) {
					bitInteger |= (1 << k);
				}
			}

			segments[i] = bitInteger;
		}
		return segments;
	}

	public static boolean isBit(int bitIndex, byte[] bytes) {

		// each byte is indexed from LSB as 0
		// -------0--------8--------16
		// 76543210 76543210 76543210
		// ---------------| <- pos 9
		//

		int byteIndex = bitIndex / 8;
		int byteAtIndex = bytes[byteIndex] & 0xFF;

		int localBitIndex = bitIndex % 8;

		return ((byteAtIndex >> localBitIndex) & 0x01) != 0;
	}

	/*
	 * Use modulus to find the desired value
	 */
	private static int computeValue(int partValue, int maxValue) {
		return partValue % maxValue;
	}

	public boolean hasFrame() {
		return frame;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		VisualCode that = (VisualCode) o;
		return Arrays.equals(figureBasis, that.figureBasis);
	}

	@Override
	public int hashCode() {
		return Arrays.hashCode(figureBasis);
	}

	public void setFrame(boolean frame, int color) {
		this.frame = frame;
		this.frameColor = color;
	}

	public byte[] getFigureBasis() {
		return figureBasis;
	}
}
