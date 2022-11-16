import Foundation
import SwiftUI

struct DepartureTimesView: View {
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
                    .minimumScaleFactor(0.5)
            }
        }
    }
}
