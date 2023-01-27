import SwiftUI

struct ChipView: View {
    let departure: DepartureLinkLabel

    var body: some View {
        Link(destination: URL(string: departure.link)!) {
            Text(departure.label)
                .lineLimit(1)
                .fixedSize()
                .padding(8)
                .background(Color("TimeTileBackgroundColor"))
                .cornerRadius(8)
                .font(DefaultFonts.bold)
        }
    }
}
