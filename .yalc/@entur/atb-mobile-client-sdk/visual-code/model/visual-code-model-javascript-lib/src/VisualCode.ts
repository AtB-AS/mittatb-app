import { VisualCodeColor } from './VisualCodeColor'
import { VisualCodePatternType } from './VisualCodePatternType'
import { VisualCodeShape } from './VisualCodeShape'
import { VisualCodeShapePosition, isMask } from './VisualCodeShapePosition'
import { VisualCodeShapeType } from './VisualCodeShapeType'

const COLORS = listByIndex(Object.values(VisualCodeColor))
const PATTERN_TYPES = listByIndex(Object.values(VisualCodePatternType))
const SHAPE_TYPES = listByIndex(Object.values(VisualCodeShapeType))
const POSITIONS = listByIndex(Object.values(VisualCodeShapePosition))

const MAX_NUM_SHAPES = 4
const BACKGROUND_COLOR_PRIMARY_SEGMENT_INDEX = 0
const BACKGROUND_COLOR_SECONDARY_SEGMENT_INDEX = 1
const BACKGROUND_PATTERN_SEGMENT_INDEX = 2
const SHAPES_POSITION_SEGMENT_INDEX = 3
const SHAPES_COLORS_SEGMENT_INDEX_OFFSET = 4
const SHAPES_TYPE_SEGMENT_INDEX_OFFSET = SHAPES_COLORS_SEGMENT_INDEX_OFFSET + MAX_NUM_SHAPES
const NUM_SEGMENTS = SHAPES_TYPE_SEGMENT_INDEX_OFFSET + MAX_NUM_SHAPES
const MIN_BITS_PER_SEGMENT = 4

function listByIndex<T>(arr: (T | string)[]): T[] {
    return arr.filter((item): item is T => typeof item === 'number').sort()
}

export class InvalidVisualCodeError extends Error {}

/*
 * Convert the byte array into a stream of bits and allocate an equal number of bits into each segment. If the number of bits is not a multiple of number of
 * segments, the remainder is discarded.
 */
export function splitIntoSegments(figureBasis: Int8Array, numSegments: number) {
    // Number of bits per part
    const numberOfBits = figureBasis.length * 8
    const bitsPerSegment = Math.floor((figureBasis.length * 8) / numSegments)

    if (bitsPerSegment < MIN_BITS_PER_SEGMENT) {
        throw new InvalidVisualCodeError(
            `Too many segments ${numSegments} for this figure basis of length ${numberOfBits}, bits per part would be ${bitsPerSegment} which is less than minimum value of ${MIN_BITS_PER_SEGMENT}`,
        )
    } else if (bitsPerSegment > 31) {
        throw new InvalidVisualCodeError(
            `Number of bits per segment in figure basis is ${bitsPerSegment} and too high for this algorithm max 31`,
        )
    }

    const segments: number[] = Array.from({ length: numSegments })
    for (let i = 0; i < numSegments; i++) {
        // Since max 31 bits are included, the integer is always
        // a positive value (the sign bit is bit number 32)
        let bitInteger = 0

        const offset = bitsPerSegment * i
        for (let k = 0; k < bitsPerSegment; k++) {
            if (isBit(offset + k, figureBasis)) {
                bitInteger |= 1 << k
            }
        }

        segments[i] = bitInteger
    }
    return segments
}

function isBit(bitIndex: number, bytes: Int8Array): boolean {
    // each byte is indexed from LSB as 0
    // -------0--------8--------16
    // 76543210 76543210 76543210
    // ---------------| <- pos 9
    //

    const byteIndex = Math.floor(bitIndex / 8)
    const byteAtIndex = bytes[byteIndex] & 0xff

    const localBitIndex = bitIndex % 8

    return ((byteAtIndex >> localBitIndex) & 0x01) != 0
}

function computeValue(partValue: number, maxValue: number) {
    return partValue % maxValue
}

function creatGetExclusiveColor(colors: VisualCodeColor[]) {
    let remainingColors = [...colors]

    const getColor = (colorHash: number) => {
        const index = computeValue(colorHash, remainingColors.length)
        return remainingColors[index]
    }

    const getExclusiveColor = (colorHash: number) => {
        const index = computeValue(colorHash, remainingColors.length)
        const color = remainingColors[index]
        remainingColors = [...remainingColors.slice(0, index), ...remainingColors.slice(index + 1)]
        return color
    }

    return { getColor, getExclusiveColor }
}

function getPattern(typeHash: number) {
    const index = computeValue(typeHash, PATTERN_TYPES.length)
    return PATTERN_TYPES[index]
}

function getShapeType(typeHash: number) {
    const index = computeValue(typeHash, SHAPE_TYPES.length)
    return SHAPE_TYPES[index]
}

function getShapePositions(positionHash: number): VisualCodeShapePosition[] {
    const positions = POSITIONS.filter(position => isMask(positionHash, position))

    if (positions.length === 0) {
        return [VisualCodeShapePosition.CENTER]
    }

    return positions
}

export type VisualCodeConfig = {
    primaryBackgroundColor: VisualCodeColor
    secondaryBackgroundColor: VisualCodeColor
    backgroundPattern: VisualCodePatternType
    shapes: VisualCodeShape[]
}

export function calculateVisualCodeConfig(figureBasis: Int8Array): VisualCodeConfig {
    const segments = splitIntoSegments(figureBasis, NUM_SEGMENTS)

    // Get colors for background, and make it so that the selected colors
    // are not reused in the shapes
    const { getColor, getExclusiveColor } = creatGetExclusiveColor(COLORS)

    const primaryBackgroundColor = getExclusiveColor(
        segments[BACKGROUND_COLOR_PRIMARY_SEGMENT_INDEX],
    )
    const secondaryBackgroundColor = getExclusiveColor(
        segments[BACKGROUND_COLOR_SECONDARY_SEGMENT_INDEX],
    )
    const backgroundPattern = getPattern(segments[BACKGROUND_PATTERN_SEGMENT_INDEX])
    const positions = getShapePositions(segments[SHAPES_POSITION_SEGMENT_INDEX])

    const shapes = positions.map((position, index): VisualCodeShape => {
        return {
            type: getShapeType(segments[SHAPES_TYPE_SEGMENT_INDEX_OFFSET + index]),
            color: getColor(segments[SHAPES_COLORS_SEGMENT_INDEX_OFFSET + index]),
            position,
        }
    })

    return {
        primaryBackgroundColor,
        secondaryBackgroundColor,
        backgroundPattern,
        shapes,
    }
}
