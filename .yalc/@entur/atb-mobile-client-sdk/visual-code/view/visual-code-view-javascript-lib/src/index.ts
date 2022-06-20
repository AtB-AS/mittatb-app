import {
    VisualCodePatternType,
    VisualCodeColor,
    VisualCodeShapePosition,
    VisualCodeShapeType,
    VisualCodeConfig,
} from '@entur/visual-code-model-javascript-lib'

function getBackgroundColorValue(color: VisualCodeColor) {
    switch (color) {
        case VisualCodeColor.BLACK:
            return '#0e0e0e'
        case VisualCodeColor.WHITE:
            return '#ffffff'
        case VisualCodeColor.BLUE:
            return '#c9dce8'
        case VisualCodeColor.GREEN:
            return '#c9e8d6'
        case VisualCodeColor.RED:
            return '#e8c9d2'
    }
}

function getShapeColorValue(color: VisualCodeColor) {
    switch (color) {
        case VisualCodeColor.BLACK:
            return '#0e0e0e'
        case VisualCodeColor.WHITE:
            return '#ffffff'
        case VisualCodeColor.BLUE:
            return '#24648f'
        case VisualCodeColor.GREEN:
            return '#1f7a43'
        case VisualCodeColor.RED:
            return '#a32949'
    }
}

function getCordinates(position: VisualCodeShapePosition): [number, number] {
    switch (position) {
        case VisualCodeShapePosition.CENTER:
            return [32, 32]
        case VisualCodeShapePosition.TOP_LEFT:
            return [8, 8]
        case VisualCodeShapePosition.TOP_RIGHT:
            return [56, 8]
        case VisualCodeShapePosition.BOTTOM_LEFT:
            return [8, 56]
        case VisualCodeShapePosition.BOTTOM_RIGHT:
            return [56, 56]
    }
}

function renderBackgroundPattern(backgroundPattern: VisualCodePatternType, color: VisualCodeColor) {
    if (backgroundPattern === VisualCodePatternType.UNIFORM) return ''

    return `
    <defs>
        <pattern id="pattern"
            patternUnits="userSpaceOnUse"
            width="16"
            height="16"
            ${
                backgroundPattern === VisualCodePatternType.VERTICAL_STRIPES
                    ? 'patternTransform="rotate(0)"'
                    : 'patternTransform="rotate(90)"'
            }
        >
            <rect x="0" width="8" height="16" fill="${getBackgroundColorValue(color)}" />
        </pattern>
    </defs>
    `
}

function renderShape(color: VisualCodeColor, shape: VisualCodeShapeType) {
    const colorValue = getShapeColorValue(color)
    switch (shape) {
        case VisualCodeShapeType.TRIANGLE:
            return `<path fill="${colorValue}" d="M10.985 0.666665C11.4361 -0.222224 12.5639 -0.222221 13.015 0.666668L23.8412 22C24.2923 22.8889 23.7285 24 22.8263 24H1.17372C0.271535 24 -0.29233 22.8889 0.158764 22L10.985 0.666665Z" />`
        case VisualCodeShapeType.HEART:
            return `<path fill="${colorValue}" x="16" y="16" d="M12 5.99755C12.0014 2.68496 14.6871 0 18 0C21.3136 0 23.9999 2.68621 24 5.99987C24 6.00234 24 6.00504 24 6.00751C23.9928 12.2711 15.1453 21.0485 12.6488 23.4006C12.2788 23.7492 11.7212 23.7492 11.3512 23.4006C8.8547 21.0485 0.00726096 12.2711 4.47686e-06 6.00751C1.49257e-06 6.00504 0 6.00257 0 6.0001C0 2.68634 2.68629 0 6 0C9.31286 0 11.9986 2.68496 12 5.99755Z" />`
        case VisualCodeShapeType.RHOMBUS:
            return `<path fill="${colorValue}" d="M0.574559 12.6331C0.224896 12.2835 0.224896 11.7165 0.574559 11.3669L11.3376 0.603824C11.6873 0.254161 12.2542 0.254161 12.6039 0.603824L23.3669 11.3669C23.7166 11.7165 23.7166 12.2835 23.3669 12.6331L12.6039 23.3962C12.2542 23.7458 11.6873 23.7458 11.3376 23.3962L0.574559 12.6331Z" />`
        case VisualCodeShapeType.STAR:
            return `<path fill="${colorValue}" d="M10.8514 0.870154C11.211 -0.290051 12.789 -0.290052 13.1486 0.870154L15.4188 8.19393H22.7908C23.9577 8.19393 24.4453 9.74531 23.5037 10.4624L17.5318 15.0104L19.808 22.3536C20.167 23.5119 18.8905 24.4708 17.9464 23.7519L12 19.2232L6.05357 23.7518C5.10954 24.4708 3.83297 23.5119 4.19203 22.3536L6.46823 15.0104L0.496268 10.4624C-0.445268 9.74531 0.0422958 8.19393 1.20918 8.19393H8.58118L10.8514 0.870154Z" />`
        case VisualCodeShapeType.SQUARE:
            return `<rect fill="${colorValue}" width="24" height="24" rx="2" />`
        case VisualCodeShapeType.CIRCLE:
            return `<circle fill="${colorValue}" cx="12" cy="12" r="12" />`
    }
}

function renderShapeWithPosition(
    color: VisualCodeColor,
    type: VisualCodeShapeType,
    position: VisualCodeShapePosition,
) {
    const [x, y] = getCordinates(position)
    return `
    <g transform="translate(${x},${y})">
        ${renderShape(color, type)}
    </g>
    `
}

export function renderVisualCode({
    primaryBackgroundColor,
    secondaryBackgroundColor,
    backgroundPattern,
    shapes,
}: VisualCodeConfig) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88">
        ${renderBackgroundPattern(backgroundPattern, secondaryBackgroundColor)}
        
        <rect width="100%" height="100%" fill="${getBackgroundColorValue(
            primaryBackgroundColor,
        )}" />
        ${
            backgroundPattern !== VisualCodePatternType.UNIFORM
                ? '<rect width="100%" height="100%" fill="url(#pattern)" />'
                : ''
        }

        ${shapes
            .map(({ color, type, position }) => renderShapeWithPosition(color, type, position))
            .join('')}
    </svg>
    `
}
