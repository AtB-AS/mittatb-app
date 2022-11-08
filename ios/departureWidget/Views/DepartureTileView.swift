import Foundation
import SwiftUI

struct DepartureTileView: View {
    let date: Date

    var body: some View {
        Text(date.formatted(.dateTime.locale(Locale(identifier: "en_UK")).hour().minute()))
            .padding(8)
            .background(Color("TimeTileBackgroundColor"))
            .cornerRadius(8)
            .lineLimit(1)
            .scaledToFit()
            .minimumScaleFactor(0.1)
            .bold()
    }
}
