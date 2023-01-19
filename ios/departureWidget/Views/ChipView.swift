import SwiftUI

struct ChipView: View {
    let label: String

    var body: some View {
        Text(label)
            .lineLimit(1)
            .fixedSize()
            .padding(8)
            .background(Color("TimeTileBackgroundColor"))
            .cornerRadius(8)
            .font(DefaultFonts.bold)
    }
}
