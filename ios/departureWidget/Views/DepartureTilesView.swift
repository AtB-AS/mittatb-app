import Foundation
import SwiftUI

struct DepartureTilesView: View {
    var departureStrings: [String]

    var body: some View {
        HStack {
            ForEach(departureStrings, id: \.self) { string in
                Text(string)
                    .padding(8)
                    .background(Color("TimeTileBackgroundColor"))
                    .cornerRadius(8)
                    .lineLimit(1)
                    .bold()
            }
        }.scaledToFit().minimumScaleFactor(0.1)
    }
}
