import SwiftUI

struct MediumView: View {
    @ObservedObject var viewModel: ViewModel
    var sizeCategory: ContentSizeCategory

    init(viewModel: ViewModel, sizeCategory: ContentSizeCategory) {
        self.viewModel = viewModel
        self.sizeCategory = sizeCategory
    }

    let largeSizeCategories: [ContentSizeCategory] = [
        .extraLarge,
        .extraExtraLarge,
        .extraExtraExtraLarge,
        .accessibilityExtraLarge,
        .accessibilityExtraExtraLarge,
        .accessibilityExtraExtraExtraLarge,
    ]

    var numberOfDepartures: Int {
        if largeSizeCategories.contains(sizeCategory) {
            return 4
        } else {
            return 5
        }
    }

    var body: some View {
        VStack {
            if let quayName = viewModel.quayName {
                HStack {
                    Text("Fra \(quayName)")
                        .bold()
                        .lineLimit(1)

                    Spacer()
                }
            }
            Spacer()
            Divider()
            Spacer()

            if let lineNumber = viewModel.lineNumber, let lineName = viewModel.lineName {
                HStack {
                    viewModel.transportModeIcon.resizable().frame(width: 20, height: 20)

                    Text("\(lineNumber) \(lineName)")
                        .lineLimit(1)
                        .foregroundColor(Color("LineInformationTextColor"))

                    Spacer()
                }
            }
            Spacer()

            DepartureTilesView(departures: viewModel.departures(numberOfdepartures: numberOfDepartures))

        }.padding(16)
    }
}
