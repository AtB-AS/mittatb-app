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
      if #available(iOSApplicationExtension 17.0, *) {
        WidgetInfoView(widgetFamily: family, viewModel: viewModel)
          .containerBackground(Color("WidgetBackgroundColor"), for: .widget)
          .widgetURL(URL(string: viewModel.deepLink(departure: nil)))
      } else {
        WidgetInfoView(widgetFamily: family, viewModel: viewModel)
          .padding(16)
          .background(Color("WidgetBackgroundColor"))
          .widgetURL(URL(string: viewModel.deepLink(departure: nil)))
      }
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
