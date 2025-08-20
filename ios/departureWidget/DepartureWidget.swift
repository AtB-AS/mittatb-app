import ActivityKit
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
struct DepartureWidgetBundle: WidgetBundle {
  var body: some Widget {
    DepartureWidget()
    if #available(iOS 16.2, *) {
      LiveActivityWidget()
    }
  }
}

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

struct DepartureWidget_Previews: PreviewProvider {
  static var previews: some View {
    Group {
      DepartureWidgetEntryView(
        entry: Provider.Entry(
          date: Date(),
          favouriteDeparture: FavouriteDeparture.dummy,
          stopPlaceGroup: StopPlaceGroup.dummy,
          departures: DepartureGroup.dummy.departures,
          state: EntryState.complete)
      ).previewContext(
        WidgetPreviewContext(family: .systemMedium)
      ).previewDisplayName("Default")

      DepartureWidgetEntryView(
        entry: Provider.Entry(
          date: Date(),
          favouriteDeparture: FavouriteDeparture.dummy,
          stopPlaceGroup: StopPlaceGroup.dummy,
          departures: [],
          state: EntryState.noFavouriteDepartures)
      ).previewContext(
        WidgetPreviewContext(family: .systemMedium)
      ).previewDisplayName("No Favorites")
    }
  }
}

@available(iOS 16.2, *)
struct LiveActivityWidget: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: LiveActivityAttributes.self) { context in
      // Lock screen/banner view
      LiveActivityLockScreenView(context: context)
    } dynamicIsland: { context in
      // Dynamic Island views
      DynamicIsland {
        // Expanded view
        DynamicIslandExpandedRegion(.leading) {
          Text(context.attributes.title)
            .font(.headline)
            .foregroundColor(.primary)
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text(context.state.status.rawValue.capitalized)
            .font(.caption)
            .foregroundColor(.secondary)
        }
        DynamicIslandExpandedRegion(.bottom) {
          if let description = context.attributes.description {
            Text(description)
              .font(.caption)
              .foregroundColor(.secondary)
              .multilineTextAlignment(.center)
          }
        }
      } compactLeading: {
        // Compact leading view
        Image(systemName: iconForActivityType(context.attributes.type))
          .foregroundColor(.primary)
      } compactTrailing: {
        // Compact trailing view
        if let scheduledTime = context.state.scheduledTime {
          Text(scheduledTime, style: .time)
            .font(.caption2)
            .foregroundColor(.primary)
        } else {
          Text("--:--")
            .font(.caption2)
            .foregroundColor(.primary)
        }
      } minimal: {
        // Minimal view
        Image(systemName: iconForActivityType(context.attributes.type))
          .foregroundColor(.primary)
      }
    }
  }
}

@available(iOS 16.2, *)
struct LiveActivityLockScreenView: View {
  let context: ActivityViewContext<LiveActivityAttributes>

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HStack {
        Image(systemName: iconForActivityType(context.attributes.type))
          .foregroundColor(.blue)

        Text(context.attributes.title)
          .font(.headline)
          .foregroundColor(.primary)

        Spacer()

        Text(context.state.status.rawValue.capitalized)
          .font(.caption)
          .padding(.horizontal, 8)
          .padding(.vertical, 4)
          .background(backgroundColorForStatus(context.state.status))
          .foregroundColor(.white)
          .cornerRadius(8)
      }

      if let description = context.attributes.description {
        Text(description)
          .font(.subheadline)
          .foregroundColor(.secondary)
      }

      // Display custom data if any
      if !context.state.customData.isEmpty {
        ForEach(Array(context.state.customData.keys.sorted()), id: \.self) { key in
          if let value = context.state.customData[key] {
            HStack {
              Text(key.capitalized + ":")
                .font(.caption)
                .foregroundColor(.secondary)
              Text(value)
                .font(.caption)
                .foregroundColor(.primary)
              Spacer()
            }
          }
        }
      }

      // Display times if available
      if let scheduledTime = context.state.scheduledTime {
        HStack {
          Text("Scheduled:")
            .font(.caption)
            .foregroundColor(.secondary)
          Text(scheduledTime, style: .time)
            .font(.caption)
            .foregroundColor(.primary)
          Spacer()
        }
      }

      if let delay = context.state.delay, delay > 0 {
        HStack {
          Text("Delay:")
            .font(.caption)
            .foregroundColor(.secondary)
          Text("\(delay) min")
            .font(.caption)
            .foregroundColor(.orange)
          Spacer()
        }
      }
    }
    .padding()
    .background(Color(UIColor.systemBackground))
    .cornerRadius(12)
  }
}

@available(iOS 16.2, *)
func iconForActivityType(_ type: ActivityType) -> String {
  switch type {
  case .departure:
    return "bus.fill"
  case .journey:
    return "location.fill"
  case .reminder:
    return "bell.fill"
  case .alert:
    return "exclamationmark.triangle.fill"
  }
}

@available(iOS 16.2, *)
func backgroundColorForStatus(_ status: ActivityStatus) -> Color {
  switch status {
  case .active:
    return .green
  case .delayed:
    return .orange
  case .cancelled:
    return .red
  case .completed:
    return .gray
  }
}
