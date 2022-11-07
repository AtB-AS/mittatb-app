import Foundation
import SwiftUI

struct TimeTileVew: View {
    let date: Date

    var body: some View {
        Text(date.formatted(.dateTime.locale(Locale(identifier: "en_UK")).hour().minute()))
            .padding(8)
            .background(Color("TimeTileBackground"))
            .cornerRadius(8)
            .scaledToFill()
            .bold()
    }
}
