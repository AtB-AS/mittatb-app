import Foundation
import SwiftUI

private enum K {
    static let padding: CGFloat = 16.0
    static let lineInformationColor = Color("LineInformationTextColor")
    static let backgroundColor = Color("WidgetBackgroundColor")
    static let widgetGradient = LinearGradient(gradient: Gradient(stops: [
        .init(color: backgroundColor, location: 0.95),
        .init(color: .clear, location: 1),
    ]), startPoint: .leading, endPoint: .trailing)
    static let iconWidth: CGFloat = 20
}

struct DepartureTimesView: View {
    var departures: [DepartureLinkLabel]
    let parentSize: CGSize
    let deepLink: String

    var width: CGFloat {
        parentSize.width
    }

    var departuresWidth: CGFloat {
        width - K.iconWidth - K.padding
    }

    var body: some View {
        HStack {
            HStack {
                ForEach(departures, id: \.self) {
                    ChipView(departure: $0)
                }
            }.frame(maxWidth: departuresWidth, alignment: .leading).clipped()
                .mask(K.widgetGradient)

            if let url = URL(string: deepLink) {
                Link(destination: url) {
                    Image(systemName: "arrow.up.forward.app")
                        .frame(width: K.iconWidth)
                        .padding(8)
                        .foregroundColor(K.lineInformationColor)
                        .widgetAccentable()
                }
            }

        }.frame(maxWidth: width, alignment: .leading)
    }
}
