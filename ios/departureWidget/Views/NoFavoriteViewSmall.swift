import SwiftUI

struct NoFavoriteViewSmall: View {
    var body: some View {
        VStack(spacing: 16) {
            Image("NoFavoriteDeparture/Small")
                .scaledToFit()
            Text("no_favorites_small")
                .foregroundColor(Color("LineInformationTextColor"))
                .lineLimit(2)
                .minimumScaleFactor(0.1)
        }
    }
}
