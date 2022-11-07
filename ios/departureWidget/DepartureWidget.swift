import SwiftUI
import WidgetKit

struct DepartureWidgetEntryView: View {
    var entry: Provider.Entry
    @ObservedObject var viewModel: ViewModel
    @Environment(\.widgetFamily) var family

    init(entry: Provider.Entry) {
        self.entry = entry
        viewModel = ViewModel(quayGroup: entry.quayGroup, date: entry.date)
    }

    var body: some View {
        ZStack {
            Color("WidgetBackground")
            if let _ = viewModel.lineInfo {
                switch family {
                case .systemMedium:
                    MediumView(viewModel: viewModel)

                case .systemSmall:
                    SmallView(viewModel: viewModel)

                default:
                    EmptyView()
                }

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
        .description("Viser relevante avganger for nærmeste favorittavgang.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct DepartureWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 5), quayGroup: QuayGroup.dummy)).previewContext(WidgetPreviewContext(family: .systemSmall))
            DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 5), quayGroup: QuayGroup.dummy)).previewContext(WidgetPreviewContext(family: .systemMedium))
        }
    }
}
