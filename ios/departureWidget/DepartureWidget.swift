import SwiftUI
import WidgetKit

struct DepartureWidgetEntryView: View {
    var entry: Provider.Entry
    @ObservedObject var viewModel: ViewModel

    init(entry: Provider.Entry) {
        self.entry = entry
        viewModel = ViewModel(quayGroup: entry.quayGroup, date: entry.date)
    }

    var body: some View {
        ZStack {
            Color("WidgetBackground")
            if let _ = viewModel.lineInfo {
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
                            .foregroundColor(Color("TextDisabled"))
                    }
                    Spacer()

                    HStack {
                        ForEach(viewModel.departures, id: \.self) { time in
                            TimeTileVew(date: time)
                        }
                    }
                }.padding(16)

            } else {
                // TODO: Base language on preference from the app
                Text("Du må velge en favorittavgang")
            }
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
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct DepartureWidget_Previews: PreviewProvider {
    static var previews: some View {
        DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 10), quayGroup: QuayGroup.dummy)).previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
