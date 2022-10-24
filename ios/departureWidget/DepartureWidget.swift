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
      if viewModel != nil {
        
          VStack{
            HStack{
              Text(viewModel.quayName)
                .bold()
              Spacer()
            }.padding(5)
            HStack{
              Text(viewModel.lineNumber)
              Text(viewModel.lineName)
              Spacer()
            }.padding(5)
         
            
            Divider()
            
            HStack{
              ForEach(viewModel.departures, id: \.self){ time in
                
                if(time.distance(to: Date()) > 0 ){
                  Text(time, style: .relative)
                    .background(.gray)
                    .foregroundColor(.white)
                    .cornerRadius(5)
                }else{
                  Text(time, style: .time)
                    .background(.gray)
                    .foregroundColor(.white)
                    .cornerRadius(5)
                }
              

              }
            }
          }
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
