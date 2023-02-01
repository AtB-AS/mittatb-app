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
        }.widgetURL(URL(string: viewModel.deepLink(departure: nil)))
    }
}

@main
struct DepartureWidget: Widget {
    private let kind: String = "departureWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: UseLocationIntent.self, provider: Provider()) { entry in
            DepartureWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("departure_widget")
        .description("about_widget")
        .supportedFamilies([.systemMedium])
    }
}
