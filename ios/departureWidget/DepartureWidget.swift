import SwiftUI
import WidgetKit

struct DepartureWidgetEntryView: View {
    var entry: Provider.Entry
    // @ObservedObject var viewModel: ViewModel

    init(entry: Provider.Entry) {
        self.entry = entry
        // TODO: Fix `entry.quayGroup`
        // viewModel = ViewModel(quayGroup: entry.quayGroup!)
    }

    var body: some View {
        if entry.quayGroup != nil {
//        VStack{
//          HStack{
//            Text(viewModel.lineNumber)
//            Text(viewModel.lineName)
//            Spacer()
//          }.padding(10)
//
//          HStack{
//            ForEach(viewModel.departures){ departure in
//              Text(departure.time.ISO8601Format())
//                .padding(10)
//                .background(.blue)
//                .cornerRadius(5)
//            }
//          }
//        }
            Text("Working!")
        } else {
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
