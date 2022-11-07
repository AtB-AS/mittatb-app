import SwiftUI

struct SmallView: View {
    @ObservedObject var viewModel: ViewModel

    var body: some View {
        VStack {
            if let quayName = viewModel.quayName {
                Text("Fra \(quayName)")
                    .bold()
                    .lineLimit(1)
            }

            Spacer()

            if let lineNumber = viewModel.lineNumber, let lineName = viewModel.lineName {
                Text("\(lineNumber) \(lineName)")
                    .lineLimit(2)
                    .multilineTextAlignment(.center)
                    .foregroundColor(Color("LineText"))
            }
            Spacer()

            HStack {
                ForEach(viewModel.departures(numberOfdepartures: 2), id: \.self) { time in
                    TimeTileVew(date: time)
                }
            }
        }.padding(16)
    }
}
