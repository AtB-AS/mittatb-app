import Foundation
import SwiftUI
import WidgetKit

class ViewModel: ObservableObject {
    // TODO: show what fields the view model is containing
    private enum K {
        static let defaultLineName = "N/A"
        static let defaultLineNumber = "N/A"
        static let defaultQuayName = "N/A"
    }

    private let quayGroup: QuayGroup?
    private let entryDate: Date
    private var calendar: Calendar
    private var locale: Locale
    private var numberOfDeparturesNextDay: Int = 0

    init(quayGroup: QuayGroup?, date: Date) {
        self.quayGroup = quayGroup
        entryDate = date

        let prefLanguage = Locale.preferredLanguages[0]
        calendar = Calendar(identifier: .gregorian)
        locale = NSLocale(localeIdentifier: prefLanguage) as Locale
        calendar.locale = locale
    }

    var quayName: String? {
        quayGroup?.quay.name
    }

    var departureGroup: DepartureGroup? {
        quayGroup?.group.first
    }

    var departureTimes: [DepartureTime] {
        departureGroup?.departures ?? []
    }

    var lineInfo: DepartureLineInfo? {
        departureGroup?.lineInfo
    }

    var lineName: String? {
        lineInfo?.lineName
    }

    var lineNumber: String? {
        lineInfo?.lineNumber
    }

    var transportModeIcon: Image {
        lineInfo?.transportMode?.icon ?? lineInfo?.transportSubmode?.icon ?? TransportMode.bus.icon
    }

    func departureStrings(n: Int) -> [String] {
        var strings: [String] = []

        for departure in getDepartureDates(max: n) {
            strings.append(dateText(date: departure))
        }

        // Making space for the extra characters that are added if departures are on a future day
        if strings.count == n {
            if numberOfDeparturesNextDay >= 4 {
                strings.removeLast(2)
            } else if numberOfDeparturesNextDay >= 1 {
                strings.removeLast()
            }
        } else {
            if numberOfDeparturesNextDay >= 4 {
                strings.removeLast()
            }
        }

        return strings
    }

    /// Returns a text represantation of the depature time containging the hour and minutre of the departure, and showing day if it is in a future day
    func dateText(date: Date) -> String {
        if !Calendar.current.isDate(date, inSameDayAs: Date.now) {
            numberOfDeparturesNextDay += 1
            let dayIndex = Calendar.current.component(.weekday, from: date)
            let weekDay = calendar.weekdaySymbols[dayIndex - 1]
            return String("\(weekDay.prefix(2))." + date.formatted(.dateTime.locale(locale).hour().minute()))
        } else {
            return String(date.formatted(.dateTime.locale(locale).hour().minute()))
        }
    }

    /// Filter relevant departure and return `aimed time`
    func getDepartureDates(max numberOfDepartures: Int) -> [Date] {
        departureTimes.filter { $0.aimedTime > entryDate }.prefix(numberOfDepartures).map(\.aimedTime)
    }
}
