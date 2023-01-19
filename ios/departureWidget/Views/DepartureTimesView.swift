import Foundation
import SwiftUI

struct DepartureTimesView: View {
    var aimedTimes: [String]

    var body: some View {
        HStack {
            ForEach(aimedTimes, id: \.self) {
                ChipView(label: $0)
            }
        }.clipShape(Rectangle())
    }
}
