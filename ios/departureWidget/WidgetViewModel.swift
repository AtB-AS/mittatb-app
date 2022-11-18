import Foundation
import SwiftUI
import WidgetKit

class WidgetViewModel: ObservableObject {
    // MARK: Private vars

    private var lineInfo: DepartureLineInfo? {
        departureGroup?.lineInfo
    }

    private var departureGroup: DepartureGroup? {
        quayGroup?.group.first
    }

    private var departureTimes: [DepartureTime] {
        departureGroup?.departures ?? []
    }

    // MARK: Public vars

    let quayGroup: QuayGroup?
    let entry: Entry

    var quayName: String? {
        quayGroup?.quay.name
    }

    var lineDetails: String? {
        guard let lineName = lineInfo?.lineName, let lineNumber = lineInfo?.lineNumber else {
            return nil
        }

        return "\(lineNumber) \(lineName)"
    }

    var transportModeIcon: Image {
        lineInfo?.transportMode?.icon ?? lineInfo?.transportSubmode?.icon ?? TransportMode.bus.icon
    }

    // MARK: Initializers

    init(entry: Entry) {
        quayGroup = entry.quayGroup
        self.entry = entry
    }

    /// Filter relevant departure and return `aimed time`
    func getDepartureAimedTimes(limit numberOfDepartures: Int) -> [String] {
        if entry.isForPreview {
            return departureTimes.map { departure in
                dateAsText(departure.aimedTime)
            }
        } else {
            return departureTimes.filter { $0.aimedTime > entry.date }.prefix(numberOfDepartures).map { departure in
                dateAsText(departure.aimedTime)
            }
        }
    }

    private func formatDate(_ date: Date) -> String {
        let dateformat = DateFormatter()
        dateformat.dateFormat = "HH:mm"
        return dateformat.string(from: date)
    }

    /// Returns a text represantation of the depature time containging the hour and minutre of the departure, and showing day if it is in a future day
    private func dateAsText(_ date: Date) -> String {
        let dateTime = formatDate(date)
        if Calendar.current.isDate(date, inSameDayAs: Date.now) || entry.isForPreview {
            return dateTime
        }

        let dayIndex = Calendar.current.component(.weekday, from: date)
        let weekDay = Calendar.current.weekdaySymbols[dayIndex - 1]

        return "\(weekDay.prefix(2)). \(dateTime)"
    }
}
