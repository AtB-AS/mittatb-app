import Foundation
import SwiftUI

public enum K {
    static let padding: CGFloat = 16.0
    static let lineInformationColor = Color("LineInformationTextColor")
    static let transportIconSize: CGFloat = 20.0
    static let transportCityColor = Color("TransportCity")
    static let backgroundColor = Color("WidgetBackgroundColor")
    static let transportIconCornerRadius: CGFloat = 2.0
    static let widgetGradient = LinearGradient(gradient: Gradient(stops: [
        .init(color: .clear, location: 0),
        .init(color: backgroundColor, location: 1),
    ]), startPoint: .leading, endPoint: .trailing)
    static let widgetFadeWidth: CGFloat = 40.0
}

struct DepartureTimesView: View {
    var aimedTimes: [String]
    let parentSize: CGSize

    var body: some View {
        HStack {
            HStack {
                ForEach(aimedTimes, id: \.self) {
                    ChipView(label: $0)
                }
            }.frame(maxWidth: parentSize.width - K.padding * 2 - 36, alignment: .leading).clipped()
                .mask(LinearGradient(gradient: Gradient(stops: [
                    .init(color: .black, location: 0.95),
                    .init(color: .clear, location: 1),
                ]), startPoint: .leading, endPoint: .trailing))

            Image(systemName: "ellipsis")
            .font(Font.system(size: 16, weight: .regular))
            .padding(8)
            .foregroundColor(K.lineInformationColor)
        }.frame(maxWidth: parentSize.width - K.padding * 2, alignment: .leading)
    }
}
