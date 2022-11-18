import Foundation
import SwiftUI

private enum K {
    static let fontSize: CGFloat = 14.0
}

struct DepartureTimesView: View {
    private var scaledFontSize: CGFloat {
        UIFontMetrics.default.scaledValue(for: K.fontSize)
    }

    var aimedTimes: [String]

    var body: some View {
        HStack {
            ForEach(aimedTimes, id: \.self) { aimedTime in
                Text(aimedTime)
                    .padding(8)
                    .background(Color("TimeTileBackgroundColor"))
                    .cornerRadius(8)
                    .lineLimit(1)
                    .bold()
                    .font(.system(size: scaledFontSize))
                    .fixedSize()
            }
        }.clipShape(Rectangle())
    }
}
