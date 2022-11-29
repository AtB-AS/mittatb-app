import Foundation
import SwiftUI
import WidgetKit

struct WidgetViewModel {
    // MARK: Private vars

    private var quayGroup: QuayGroup? {
        entry.quayGroup
    }

    private var departureGroup: DepartureGroup? {
        quayGroup?.group.first
    }

    private var departureTimes: [DepartureTime] {
        departureGroup?.departures ?? []
    }

    // MARK: Public vars

    let entry: Entry

    var quayName: String {
        entry.favouriteDeparture?.quayName ?? "Unknow"
    }

    var lineDetails: String {
        guard let lineName = entry.favouriteDeparture?.lineName, let lineNumber = entry.favouriteDeparture?.lineLineNumber else {
            return "No line information"
        }

        return "\(lineNumber) \(lineName)"
    }

    var transportModeIcon: Image {
        entry.favouriteDeparture?.lineTransportationMode?.icon ?? entry.favouriteDeparture?.lineTransportationSubMode?.icon ?? TransportMode.bus.icon
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
