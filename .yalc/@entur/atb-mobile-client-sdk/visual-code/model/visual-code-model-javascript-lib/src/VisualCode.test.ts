import { splitIntoSegments } from './VisualCode'

describe('splitIntoSegments', () => {
    it('should work', () => {
        const figureBasis = new Int8Array([
            -49, 60, 27, -108, 75, -113, 59, 18, -14, 100, -50, -107, 127, 93, 45, -112,
        ])
        const segments = splitIntoSegments(figureBasis, 12)
        expect(segments).toEqual([207, 719, 321, 302, 911, 142, 801, 403, 462, 997, 471, 181])
    })
})
