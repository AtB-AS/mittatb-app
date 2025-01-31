import Foundation
import SwiftUI
import WidgetKit

struct WidgetViewModel {
    // MARK: Private vars

    private var quayGroup: QuayGroup? {
        // Api may return empty quays, therefore needs to find the correct one
        guard let quayGroup = entry.stopPlaceGroup?.quays.first(where: { $0.quay.id == entry.favouriteDeparture?.quayId }) else {
            return nil
        }
        return quayGroup
    }

    private var stopPlaceInfo: StopPlaceInfo? {
        entry.stopPlaceGroup?.stopPlace
    }

    private var departureGroup: DepartureGroup? {
        quayGroup?.group.first
    }

    private var departureTimes: [DepartureTime] {
        entry.departures ?? departureGroup?.departures ?? []
    }

    private var lineInfo: DepartureLineInfo? {
        departureGroup?.lineInfo
    }

    private var lineName: String? {
        entry.favouriteDeparture?.lineName ?? NSLocalizedString("all_variations", comment: "")
    }

    private var lineNumber: String? {
        entry.favouriteDeparture?.lineLineNumber ?? lineInfo?.lineNumber
    }

    // MARK: Public vars

    let entry: DepartureWidgetEntry

    func deepLink(departure: DepartureTime?) -> String {
        guard let appScheme = Bundle.app.object(forInfoDictionaryKey: "AppScheme") else {
            return ("atb-dev://error")
        }

        if entry.state == .noFavouriteDepartures {
            return "\(appScheme)://widget/addFavoriteDeparture"
        }

        guard let stopPlace = stopPlaceInfo, let quay = quayGroup?.quay else {
            return String("error")
        }

        var link = "\(appScheme)://widget"

        var queryItems = [
            URLQueryItem(name: "stopId", value: stopPlace.id),
            URLQueryItem(name: "stopName", value: stopPlace.name),
            URLQueryItem(name: "quayId", value: quay.id),
            URLQueryItem(name: "latitude", value: String(stopPlace.latitude)),
            URLQueryItem(name: "longitude", value: String(stopPlace.longitude)),
        ]

        if let departure = departure {
            link.append("details")
            queryItems.append(contentsOf: [
                URLQueryItem(name: "serviceJourneyId", value: departure.serviceJourneyId),
                URLQueryItem(name: "date", value: toISOString(departure.aimedTime)),
                URLQueryItem(name: "serviceDate", value: departure.serviceDate),
                URLQueryItem(name: "fromStopPosition", value: String(departure.stopPositionInPattern)),
            ])
        }

        var urlComponents = URLComponents(string: link)
        urlComponents?.queryItems = queryItems

        guard let url = urlComponents?.string else {
            return String("error")
        }

        return url
    }

    var quayName: String? {
        entry.favouriteDeparture?.quayName ?? quayGroup?.quay.name
    }

    var lineDetails: String? {
        guard let lineName = lineName, let lineNumber = lineNumber else {
            return nil
        }

        return "\(lineNumber) \(lineName)"
    }

    var transportModeIcon: Image? {
        entry.favouriteDeparture?.lineTransportationMode?.icon ?? TransportMode.bus.icon
    }

    var transportModeIconForegroundColor: Color? {
        entry.favouriteDeparture?.lineTransportationSubMode?.iconForegroundColor ?? entry.favouriteDeparture?.lineTransportationMode?.iconForegroundColor ?? TransportMode.bus.iconForegroundColor
    }

    var transportModeIconBackgroundColor: Color? {
        entry.favouriteDeparture?.lineTransportationSubMode?.iconBackgroundColor ?? entry.favouriteDeparture?.lineTransportationMode?.iconBackgroundColor ?? TransportMode.bus.iconBackgroundColor
    }

    /// Filter relevant departure and return `aimed time`
    func getDepartureAimedTimes(limit numberOfDepartures: Int) -> [DepartureLinkLabel] {
        if entry.state == .preview {
            return departureTimes.map { departure in
                dateAsText(departure)
            }
        }

        return departureTimes.filter { $0.aimedTime > entry.date }.prefix(numberOfDepartures).map { departure in
            dateAsText(departure)
        }
    }

    /// Returns a text represantation of the depature time containging the hour and minutre of the departure, and showing day if it is in a future day
    private func dateAsText(_ departureTime: DepartureTime) -> DepartureLinkLabel {
        let dateTime = formatDate(departureTime.aimedTime)

        if Calendar.current.isDate(departureTime.aimedTime, inSameDayAs: Date.now) {
            return DepartureLinkLabel(label: dateTime, link: deepLink(departure: departureTime))
        }

        let dayIndex = Calendar.current.component(.weekday, from: departureTime.aimedTime)
        let weekDay = Calendar.current.weekdaySymbols[dayIndex - 1]

        let string = "\(weekDay.prefix(2)). \(dateTime)"

        return DepartureLinkLabel(label: string, link: deepLink(departure: departureTime))
    }

    private func formatDate(_ date: Date) -> String {
        let dateformat = DateFormatter()
        dateformat.dateFormat = "HH:mm"
        return dateformat.string(from: date)
    }
  
    private func toISOString(_ date: Date) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]
        return formatter.string(from: date)
    }
}
