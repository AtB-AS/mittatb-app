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
                }.padding(.leading, 5)

                Divider()

                HStack {
                    ForEach(viewModel.departures, id: \.self) { time in

                        if time.distance(to: Date()) < 0 {
                            if time.distance(to: Date()) > -600 {
                              Text(time, style: .relative)
                                    .background(.gray)
                                    .foregroundColor(.white)
                                    .cornerRadius(5)
                            } else {
                                Text(time, style: .time)
                                    .background(.gray)
                                    .foregroundColor(.white)
                                    .cornerRadius(5)
                            }
                        }
                    }
                }
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
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}
