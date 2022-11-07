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
        .accessibilityMedium,
        .accessibilityLarge,
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
        VStack(spacing: 16) {
            if let quayName = viewModel.quayName {
                HStack {
                    Text("Fra \(quayName)")
                        .bold()
                        .lineLimit(1)

                    Spacer()
                }
            }
            Divider()

            if let lineNumber = viewModel.lineNumber, let lineName = viewModel.lineName {
                HStack {
                    Image("BusIcon")

                    Text("\(lineNumber) \(lineName)")
                        .lineLimit(1)
                        .foregroundColor(Color("LineText"))

                    Spacer()
                }
            }
            HStack(spacing: 8) {
                ForEach(viewModel.departures(numberOfdepartures: numberOfDepartures), id: \.self) { time in
                  TimeTileVew(date: time)
                }
            }
        }
        .padding(16)
    }
}
