import SwiftUI
import WidgetKit

private enum K {
    static let padding: CGFloat = 16.0
    static let lineInformationColor = Color("LineInformationTextColor")
    static let transportIconSize: CGFloat = 20.0
    static let transportCityColor = Color("TransportCity")
    static let backgroundColor = Color("WidgetBackgroundColor")
    static let transportIconCornerRadius: CGFloat = 2.0
}

struct WidgetInfoView: View {
    @Environment(\.widgetRenderingMode) var widgetRenderingMode

    let widgetFamily: WidgetFamily
    var viewModel: WidgetViewModel

    private var numberOfDepartures: Int {
        widgetFamily == .systemMedium ? 6 : 3
    }

    private var departures: [DepartureLinkLabel] {
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
                            .frame(width: geometry.size.width, alignment: widgetFamily == .systemMedium ? .leading : .center)
                            .font(DefaultFonts.boldHeader)

                        Spacer()
                        if widgetFamily == .systemMedium {
                            Divider().frame(width: geometry.size.width)
                            Spacer()
                        }

                        let noLineInfoText = NSLocalizedString("no_line_info", comment: "")
                        if widgetFamily == .systemSmall {
                            Text(viewModel.lineDetails ?? noLineInfoText)
                                .lineLimit(2)
                                .multilineTextAlignment(.center)
                                .frame(width: geometry.size.width, alignment: .center)
                                .foregroundColor(K.lineInformationColor)
                        } else {
                            HStack {
                                if let icon = viewModel.transportModeIcon {
                                    icon
                                        .resizable()
                                        .renderingMode(.template)
                                        .scaledToFit()
                                        .foregroundColor(viewModel.transportModeIconForegroundColor)
                                        .padding(K.transportIconSize / 7)
                                        .frame(width: K.transportIconSize, height: K.transportIconSize)
                                        .background(viewModel.transportModeIconBackgroundColor?.opacity(widgetRenderingMode == .accented ? 0.2 : 1))
                                        .cornerRadius(K.transportIconCornerRadius)
                                        .widgetAccentable()
                                }

                                Text(viewModel.lineDetails ?? noLineInfoText)
                                    .lineLimit(1)
                                    .foregroundColor(widgetRenderingMode == .accented ? .secondary : K.lineInformationColor)

                                Spacer()
                            }
                        }

                        Spacer()

                        if viewModel.entry.state == .noDepartureQuays {
                            Text("no_departures").font(DefaultFonts.bold).frame(maxWidth: .infinity)
                                .lineLimit(1)
                                .padding(8)
                                .background(Color("TimeTileBackgroundColor"))
                                .cornerRadius(8)
                        } else {
                            DepartureTimesView(departures: departures, parentSize: geometry.size, deepLink: viewModel.deepLink(departure: nil))
                        }
                    }
                }
            }
        }
    }
}
