import SwiftUI

struct DefaultFonts {
    private func scaledFontSize(size: CGFloat) -> CGFloat {
        return UIFontMetrics.default.scaledValue(for: size)
    }

    static let bold = Font.system(size: 14).weight(Font.Weight.bold)
    static let bold_header = Font.system(size: 16).weight(Font.Weight.bold)
}
