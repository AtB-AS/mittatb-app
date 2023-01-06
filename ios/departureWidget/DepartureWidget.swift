import SwiftUI
import WidgetKit

struct DepartureWidgetEntryView: View {
    @Environment(\.widgetFamily) var family: WidgetFamily

    private let viewModel: WidgetViewModel

    let entry: Provider.Entry

    init(entry: Provider.Entry) {
        self.entry = entry
        viewModel = WidgetViewModel(entry: entry)
    }

    var body: some View {
        ZStack {
            Color("WidgetBackgroundColor")
            WidgetInfoView(widgetFamily: family, viewModel: viewModel)
        }.widgetURL(URL(string: viewModel.deepLink))
    }
}

@main
struct DepartureWidget: Widget {
    private let kind: String = "departureWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DepartureWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Widget")
        .description("about_widget")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct DepartureWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 5), favouriteDeparture: FavouriteDeparture.dummy, stopPlaceGroup: StopPlaceGroup.dummy, state: .preview)).previewContext(WidgetPreviewContext(family: .systemSmall))
            DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 5), favouriteDeparture: FavouriteDeparture.dummy, stopPlaceGroup: StopPlaceGroup.dummy, state: .preview)).previewContext(WidgetPreviewContext(family: .systemMedium))
        }
    }
}
