export enum VisualCodeShapePosition {
    CENTER = 0,
    TOP_LEFT = 0x01,
    TOP_RIGHT = 0x02,
    BOTTOM_LEFT = 0x04,
    BOTTOM_RIGHT = 0x08,
}

export function isMask(value: number, mask: VisualCodeShapePosition) {
    return (value & mask) !== 0
}
