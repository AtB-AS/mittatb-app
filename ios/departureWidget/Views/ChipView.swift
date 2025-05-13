import SwiftUI

struct ChipView: View {
    @Environment(\.widgetRenderingMode) var widgetRenderingMode

    let departure: DepartureLinkLabel

    var body: some View {
        if let url = URL(string: departure.link) {
            Link(destination: url) {
                Text(departure.label)
                    .lineLimit(1)
                    .fixedSize()
                    .padding(8)
                    .background(Color("TimeTileBackgroundColor").opacity(widgetRenderingMode == .accented ? 0.2 : 1))
                    .cornerRadius(8)
                    .font(DefaultFonts.bold)
            }
        }
    }
}
