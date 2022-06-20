import { DrawingSVG } from '../vendor/bwip-js/drawingSVG'
import { Render, Options } from '../vendor/bwip-js/exports'

export function renderAztec(text: string, options?: Omit<Options, 'bcid' | 'text'>) {
    const params: Options = {
        bcid: 'azteccode',
        text,
        ...options,
    }

    return Render(params, DrawingSVG(params))
}

export function renderQR(text: string, options?: Omit<Options, 'bcid' | 'text'>) {
    const params: Options = {
        bcid: 'qrcode',
        text,
        ...options,
    }

    return Render(params, DrawingSVG(params))
}
