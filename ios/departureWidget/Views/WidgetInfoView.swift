import SwiftUI
import WidgetKit

private enum K {
    static let padding: CGFloat = 16.0
    static let lineInformationColor = Color("LineInformationTextColor")
    static let transportIconSize: CGFloat = 20.0
    static let transportCityColor = Color("TransportCity")
    static let backgroundColor = Color("WidgetBackgroundColor")
    static let transportIconCornerRadius: CGFloat = 2.0
    static let widgetGradient = LinearGradient(gradient: Gradient(stops: [
        .init(color: .clear, location: 0),
        .init(color: backgroundColor, location: 1),
    ]), startPoint: .leading, endPoint: .trailing)
    static let widgetFadeWidth: CGFloat = 40.0
}

struct WidgetInfoView: View {
    let widgetFamily: WidgetFamily
    var viewModel: WidgetViewModel

    private var numberOfDepartures: Int {
        widgetFamily == .systemMedium ? 6 : 3
    }

    private var aimedTimes: [String] {
        viewModel.getDepartureAimedTimes(limit: numberOfDepartures)
    }

    var body: some View {
        if viewModel.entry.state == .noFavouriteDepartures {
            switch widgetFamily {
            case .systemMedium:
                NoFavoriteViewMedium()

            case .systemSmall:
                NoFavoriteViewSmall()
            default:
                Text("Error")
            }

        } else {
            GeometryReader { geometry in
                ZStack {
                    VStack(alignment: .leading) {
                        let quayName = viewModel.quayName ?? NSLocalizedString("no_quay_name", comment: "")
                        Text("From \(quayName)")
                            .lineLimit(1)
                            .frame(width: geometry.size.width - (K.padding * 2), alignment: .leading)
                            .font(DefaultFonts.boldHeader)

                        Spacer()
                        if widgetFamily == .systemMedium {
                            Divider().frame(width: geometry.size.width - (K.padding * 2))
                            Spacer()
                        }

                        let noLineInfoText = NSLocalizedString("no_line_info", comment: "")
                        if widgetFamily == .systemSmall {
                            Text(viewModel.lineDetails ?? noLineInfoText)
                                .lineLimit(2)
                                .multilineTextAlignment(.leading)
                                .foregroundColor(K.lineInformationColor)
                        } else {
                            HStack {
                                if let icon = viewModel.transportModeIcon {
                                    icon
                                        .resizable()
                                        .frame(width: K.transportIconSize, height: K.transportIconSize)
                                        .background(K.transportCityColor)
                                        .cornerRadius(K.transportIconCornerRadius)
                                }

                                Text(viewModel.lineDetails ?? noLineInfoText)
                                    .lineLimit(1)
                                    .foregroundColor(K.lineInformationColor)

                                Spacer()
                            }
                        }

                        Spacer()

                        if viewModel.entry.state == .noDepartureQuays {
                            HStack {
                                Spacer()
                                Text("no_departures").font(DefaultFonts.bold)
                                Spacer()
                            }.frame(maxWidth: .infinity)
                                .lineLimit(1)
                                .padding(8)
                                .background(Color("TimeTileBackgroundColor"))
                                .cornerRadius(8)
                                .font(DefaultFonts.boldHeader)
                        } else {
                            DepartureTimesView(aimedTimes: aimedTimes)
                        }
                    }
                    .padding(K.padding)
                }
                HStack {
                    Spacer()
                    Rectangle()
                        .fill(K.widgetGradient).frame(width: K.widgetFadeWidth)
                }.frame(width: geometry.size.width)
            }
        }
    }
}
