import SwiftUI

struct DefaultFonts {
    private static let fontSize: CGFloat = 14.0
    static var scaledFontSize: CGFloat {
        UIFontMetrics.default.scaledValue(for: fontSize)
    }

    static let body = Font.system(size: DefaultFonts.scaledFontSize)
    static let subtitle = body.weight(Font.Weight.bold)
}
