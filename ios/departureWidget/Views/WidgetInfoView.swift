import SwiftUI
import WidgetKit

private enum K {
    static let padding: CGFloat = 16.0
    static let lineInformationColor = Color("LineInformationTextColor")
    static let transportIconSize: CGFloat = 20.0
    static let transportCityColor = Color("TransportCity")
    static let transportIconCornerRadius: CGFloat = 2.0
}

struct WidgetInfoView: View {
    let widgetFamily: WidgetFamily
    @ObservedObject var viewModel: WidgetViewModel

    private var numberOfDepartures: Int {
        widgetFamily == .systemMedium ? 4 : 2
    }

    private var aimedTimes: [String] {
        viewModel.getDepartureAimedTimes(limit: numberOfDepartures)
    }

    // TODO: Localize texts
    var body: some View {
        if let quayName = viewModel.quayName, let lineDetails = viewModel.lineDetails {
            GeometryReader { geometry in
                VStack(alignment: .leading) {
                    VStack(alignment: .center) {
                        Text("Fra \(quayName)")
                            .bold()
                            .lineLimit(1)
                        Spacer(minLength: K.padding)
                        if widgetFamily == .systemMedium {
                            Divider()
                            Spacer(minLength: K.padding)
                        }
                        if widgetFamily == .systemSmall {
                            Text(lineDetails)
                                .lineLimit(2)
                                .multilineTextAlignment(.center)
                                .foregroundColor(K.lineInformationColor)
                        } else {
                            HStack {
                                viewModel.transportModeIcon
                                    .resizable()
                                    .frame(width: K.transportIconSize, height: K.transportIconSize)
                                    .background(K.transportCityColor)
                                    .cornerRadius(K.transportIconCornerRadius)

                                Text(lineDetails)
                                    .lineLimit(1)
                                    .foregroundColor(K.lineInformationColor)

                                Spacer()
                            }
                        }
                    }
                    .frame(width: geometry.size.width - (K.padding * 2))
                    .padding(.trailing, K.padding)
                    Spacer(minLength: K.padding)
                    DepartureTimesView(aimedTimes: aimedTimes)
                }
                .padding(EdgeInsets(top: K.padding, leading: K.padding, bottom: K.padding, trailing: 0))
            }
        } else {
            // TODO: Refactor with a better error view
            Text("Du må velge en favorittavgang").padding()
        }
    }
}
