import WidgetKit
import SwiftUI


struct departureWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
      
      
      if(entry.departureGroup != nil){
        HStack{
          Text(entry.departureGroup!.lineInfo!.lineNumber)
          Text(entry.departureGroup!.lineInfo!.lineName)
          Spacer()
        }.padding(10)
        
        Spacer()
        HStack{
          ForEach(entry.departureGroup!.departures){ departure in
            Text(departure.time, format: .dateTime.hour().minute()).padding(10)
          }
        }
        Spacer()

      }else{
        Text("Du må velge en favorittavgang")
      }
    }
}

@main
struct departureWidget: Widget {
    let kind: String = "departureWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            departureWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}

