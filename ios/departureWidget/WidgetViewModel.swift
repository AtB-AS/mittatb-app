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
        departureGroup?.departures ?? []
    }

    private var lineInfo: DepartureLineInfo? {
        departureGroup?.lineInfo
    }

    private var lineName: String? {
        entry.favouriteDeparture?.lineName ?? lineInfo?.lineName
    }

    private var lineNumber: String? {
        entry.favouriteDeparture?.lineLineNumber ?? lineInfo?.lineNumber
    }

    // MARK: Public vars

    let entry: Entry

    var deepLink: String {
        guard let appScheme = Bundle.app.object(forInfoDictionaryKey: "AppScheme") else {
            return ("atb-dev://error")
        }

        if entry.state == .noFavouriteDepartures {
            return "\(appScheme)://widget/addFavoriteDeparture"
        }

        guard let stopPlace = stopPlaceInfo, let quay = quayGroup?.quay else {
            return String("error")
        }

        var urlComponents = URLComponents(string: "\(appScheme)://widget")
        urlComponents?.queryItems = [
            URLQueryItem(name: "stopId", value: stopPlace.id),
            URLQueryItem(name: "stopName", value: stopPlace.name),
            URLQueryItem(name: "quayId", value: quay.id),
            URLQueryItem(name: "latitude", value: String(stopPlace.latitude)),
            URLQueryItem(name: "longitude", value: String(stopPlace.longitude)),
        ]

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
    
    var transportModeIconForegroundColor : Color? {
      entry.favouriteDeparture?.lineTransportationSubMode?.iconForegroundColor ?? entry.favouriteDeparture?.lineTransportationMode?.iconForegroundColor ?? TransportMode.bus.iconForegroundColor
    }
    var transportModeIconBackgroundColor : Color? {
      entry.favouriteDeparture?.lineTransportationSubMode?.iconBackgroundColor ?? entry.favouriteDeparture?.lineTransportationMode?.iconBackgroundColor ?? TransportMode.bus.iconBackgroundColor
    }

    /// Filter relevant departure and return `aimed time`
    func getDepartureAimedTimes(limit numberOfDepartures: Int) -> [String] {
        if entry.state == .preview {
            return departureTimes.map { departure in
                dateAsText(departure.aimedTime)
            }
        }

        return departureTimes.filter { $0.aimedTime > entry.date }.prefix(numberOfDepartures).map { departure in
            dateAsText(departure.aimedTime)
        }
    }

    /// Returns a text represantation of the depature time containging the hour and minutre of the departure, and showing day if it is in a future day
    private func dateAsText(_ date: Date) -> String {
        let dateTime = formatDate(date)
        if Calendar.current.isDate(date, inSameDayAs: Date.now) {
            return dateTime
        }

        let dayIndex = Calendar.current.component(.weekday, from: date)
        let weekDay = Calendar.current.weekdaySymbols[dayIndex - 1]

        return "\(weekDay.prefix(2)). \(dateTime)"
    }

    private func formatDate(_ date: Date) -> String {
        let dateformat = DateFormatter()
        dateformat.dateFormat = "HH:mm"
        return dateformat.string(from: date)
    }
}
