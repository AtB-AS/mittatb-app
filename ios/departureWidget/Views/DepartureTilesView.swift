import Foundation
import SwiftUI

struct DepartureTilesView: View {
    let departures: [Date]

    var body: some View {
        HStack {
            ForEach(departures, id: \.self) { time in
                Text(time.formatted(.dateTime.locale(Locale(identifier: "en_UK")).hour().minute()))
                    .padding(8)
                    .background(Color("TimeTileBackgroundColor"))
                    .cornerRadius(8)
                    .lineLimit(1)
                    .bold()
            }
        }.scaledToFit().minimumScaleFactor(0.1)
    }
}
