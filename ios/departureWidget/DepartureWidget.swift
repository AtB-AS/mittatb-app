import SwiftUI
import WidgetKit

struct DepartureWidgetEntryView: View {
    var entry: Provider.Entry
    @ObservedObject var viewModel: ViewModel

    init(entry: Provider.Entry) {
        self.entry = entry
        viewModel = ViewModel(quayGroup: entry.quayGroup)
    }

    var body: some View {
        if let _ = viewModel.lineInfo {
            VStack {
                VStack {
                    HStack {
                        if let quayName = viewModel.quayName {
                            Text(quayName)
                                .bold()
                        }
                        Spacer()
                    }
                    if let lineNumber = viewModel.lineNumber, let lineName = viewModel.lineName {
                        HStack {
                            Text(lineNumber)
                            Text(lineName)
                                .lineLimit(1)

                            Spacer()
                        }
                    }
                }.padding(10).background(.green)

                HStack {
                    ForEach(viewModel.departures, id: \.self) { time in
                        Text(time, style: .time)
                            .padding(3)
                            .background(.gray)
                            .foregroundColor(.white)
                            .cornerRadius(5)
                    }
                }.padding(5)
                Spacer()
            }
        } else {
            // TODO: Base language on preference from the app
            Text("Du må velge en favorittavgang")
        }
    }
}

@main
struct departureWidget: Widget {
    let kind: String = "departureWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DepartureWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Favorittavganger")
        .description("Viser førstkommende avganger for nærmeste favorittavgang.")
    }
}

struct DepartureWidget_Previews: PreviewProvider {
    static var previews: some View {
        DepartureWidgetEntryView(entry: Entry(date: Date(), quayGroup: QuayGroup.dummy)).previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
