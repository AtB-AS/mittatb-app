import { resolve } from 'path'
import { readFileSync } from 'fs'
import { webcrypto } from 'node:crypto'

import { createInvertableVisualCode } from './InvertableVisualCode'
import { VisualCodeConfig } from './VisualCode'
import { VisualCodeColor } from './VisualCodeColor'
import { VisualCodeShapeType } from './VisualCodeShapeType'
import { VisualCodeShapePosition } from './VisualCodeShapePosition'
import { VisualCodePatternType } from './VisualCodePatternType'

type ShapeExpectation = {
    type: keyof typeof VisualCodeShapeType
    position: keyof typeof VisualCodeShapePosition
    color: keyof typeof VisualCodeColor
}

type VisualCodeExpectaion = {
    primaryBackgroundColor: keyof typeof VisualCodeColor
    secondaryBackgroundColor: keyof typeof VisualCodeColor
    backgroundPattern: keyof typeof VisualCodePatternType
    shapes: ShapeExpectation[]
}

type VisualCodeTestExpectaion = {
    nonce: string
    visualCode: {
        standard: VisualCodeExpectaion
        inverted: VisualCodeExpectaion
    }
}

describe('InvertableVisualCode', () => {
    beforeAll(() => {
        Object.defineProperty(global, 'crypto', {
            value: webcrypto,
        })
    })

    const readExpectaions = (): VisualCodeTestExpectaion[] => {
        const data = readFileSync(resolve(__dirname, '../mocks/visualCode.json'), 'utf-8')
        return JSON.parse(data)
    }

    const testVisualCode = async ({ nonce, visualCode }: VisualCodeTestExpectaion) => {
        const { standard, inverted } = await createInvertableVisualCode(nonce)

        const test = (config: VisualCodeConfig, expectaion: VisualCodeExpectaion) => {
            expect(config.primaryBackgroundColor).toEqual(
                VisualCodeColor[expectaion.primaryBackgroundColor],
            )
            expect(config.secondaryBackgroundColor).toEqual(
                VisualCodeColor[expectaion.secondaryBackgroundColor],
            )
            expect(config.backgroundPattern).toEqual(
                VisualCodePatternType[expectaion.backgroundPattern],
            )

            expect(config.shapes).toHaveLength(expectaion.shapes.length)
            config.shapes.forEach((shape, index) => {
                const expectedShape = expectaion.shapes[index]
                expect(shape.type).toEqual(VisualCodeShapeType[expectedShape.type])
                expect(shape.color).toEqual(VisualCodeColor[expectedShape.color])
                expect(shape.position).toEqual(VisualCodeShapePosition[expectedShape.position])
            })
        }

        test(standard, visualCode.standard)
        test(inverted, visualCode.inverted)
    }

    readExpectaions().forEach(testExpectaion => {
        it(testExpectaion.nonce, () => testVisualCode(testExpectaion))
    })
})
