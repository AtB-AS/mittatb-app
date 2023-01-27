import Foundation
import SwiftUI

struct DepartureTimesView: View {
    var departures: [DepartureLinkLabel]

    var body: some View {
        HStack {
            ForEach(departures, id: \.self) {
                ChipView(departure: $0)
            }
        }.clipShape(Rectangle())
    }
}
