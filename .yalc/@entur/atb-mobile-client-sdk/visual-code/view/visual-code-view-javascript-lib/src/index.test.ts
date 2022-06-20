import { webcrypto } from 'node:crypto'

import { createInvertableVisualCode } from '@entur/visual-code-model-javascript-lib'
import { renderVisualCode } from './index'

describe('renderVisualCode', () => {
    beforeAll(() => {
        Object.defineProperty(global, 'crypto', {
            value: webcrypto,
        })
    })

    it('should work', async () => {
        const { standard } = await createInvertableVisualCode('AAECvmfdksajvnsdbvfdjsAwQFBgc=')
        console.log(renderVisualCode(standard))
    })
})
