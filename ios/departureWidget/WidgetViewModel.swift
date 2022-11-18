import Foundation
import SwiftUI
import WidgetKit

private enum K {
    static let locale = Locale(identifier: "nb")
}

class WidgetViewModel: ObservableObject {
    // MARK: Private vars

    private var calendar: Calendar

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

        calendar = Calendar(identifier: .gregorian)
        calendar.locale = K.locale
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

    /// Returns a text represantation of the depature time containging the hour and minutre of the departure, and showing day if it is in a future day
    private func dateAsText(_ date: Date) -> String {
        let dateTime = date.formatted(.dateTime.locale(K.locale).hour().minute())
        if Calendar.current.isDate(date, inSameDayAs: Date.now) || entry.isForPreview {
            return dateTime
        }

        let dayIndex = Calendar.current.component(.weekday, from: date)
        let weekDay = calendar.weekdaySymbols[dayIndex - 1]

        return "\(weekDay.prefix(2)). \(dateTime)"
    }
}
