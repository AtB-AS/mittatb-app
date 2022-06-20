export enum VisualCodeColor {
    BLACK,
    WHITE,
    BLUE,
    GREEN,
    RED,
}

export enum VisualCodeShapeType {
    SQUARE,
    STAR,
    CIRCLE,
    TRIANGLE,
    RHOMBUS,
    HEART,
}

export enum VisualCodeShapePosition {
    CENTER,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
}

export enum VisualCodePatternType {
    UNIFORM,
    HORIZONTAL_STRIPES,
    VERTICAL_STRIPES,
}

export type VisualCodeShape = {
    type: VisualCodeShapeType
    position: VisualCodeShapePosition
    color: VisualCodeColor
}
