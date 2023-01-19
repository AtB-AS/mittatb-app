import SwiftUI

struct NoFavoriteViewMedium: View {
    var body: some View {
        HStack(spacing: 16) {
            Image("NoFavoriteDeparture/Medium")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 60)
            Text("no_favorites_medium")
                .foregroundColor(Color("LineInformationTextColor"))
                .lineLimit(2)
                .minimumScaleFactor(0.1)
        }.padding(16)
    }
}
