import { VisualCodeShapeType } from './VisualCodeShapeType'
import { VisualCodeColor } from './VisualCodeColor'
import { VisualCodeShapePosition } from './VisualCodeShapePosition'

export type VisualCodeShape = {
    type: VisualCodeShapeType
    position: VisualCodeShapePosition
    color: VisualCodeColor
}
