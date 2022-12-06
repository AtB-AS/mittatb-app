import SwiftUI

private enum K {
    private static let fontSize: CGFloat = 14.0
    static var scaledFontSize: CGFloat {
        UIFontMetrics.default.scaledValue(for: fontSize)
    }
}

struct ChipView: View {
    let label: String

    var body: some View {
        Text(label)
            .lineLimit(1)
            .bold()
            .font(.system(size: K.scaledFontSize))
            .fixedSize()
            .padding(8)
            .background(Color("TimeTileBackgroundColor"))
            .cornerRadius(8)
    }
}
