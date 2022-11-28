import SwiftUI
import WidgetKit

struct DepartureWidgetEntryView: View {
    var entry: Provider.Entry
    @ObservedObject var viewModel: WidgetViewModel
    @Environment(\.widgetFamily) var family: WidgetFamily
    @Environment(\.sizeCategory) var sizeCategory: ContentSizeCategory

    init(entry: Provider.Entry) {
        self.entry = entry
        viewModel = WidgetViewModel(entry: entry)
    }

    var body: some View {
        ZStack {
            Color("WidgetBackgroundColor")
            WidgetInfoView(widgetFamily: family, viewModel: viewModel)
        }
    }
}

@main
struct DepartureWidget: Widget {
    let kind: String = "departureWidget"

    let locationManager = LocationChangeManager.shared

    init() {
        locationManager.onLocationDidChange = { _ in
            WidgetUpdater.requestUpdate()
        }
    }

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DepartureWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Favorittavganger")
        .description("Se avganger for din nærmeste favoritt.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct DepartureWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 5), quayGroup: QuayGroup.dummy, isForPreview: true)).previewContext(WidgetPreviewContext(family: .systemSmall))
            DepartureWidgetEntryView(entry: Entry(date: Date.now.addingTimeInterval(60 * 5), quayGroup: QuayGroup.dummy, isForPreview: true)).previewContext(WidgetPreviewContext(family: .systemMedium))
        }
    }
}
