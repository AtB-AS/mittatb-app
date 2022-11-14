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

    var lineInfo: DepartureLineInfo? {
        quayGroup?.group.first?.lineInfo
    }

    var lineName: String? {
        lineInfo?.lineName
    }

    var lineNumber: String? {
        lineInfo?.lineNumber
    }

    var transportModeIcon: Image {
        if lineInfo?.transportSubmode == "regionBus" || lineInfo?.transportSubmode == "nightBus" {
            return Image("RegionBusIcon")
        }
        switch lineInfo?.transportMode {
        case "water":
            return Image("BoatIcon")
        case "rail":
            return Image("TrainIcon")
        case "tram":
            return Image("TramIcon")
        default:
            return Image("BusIcon")
        }
    }

    func departureStrings(n: Int) -> [String] {
        var strings: [String] = []
      
        for departure in departures(numberOfDepartures: n) {
            strings.append(dateText(date: departure))
        }
        
        //Making space for the extra text that comes with showing day
        if numberOfDeparturesNextDay == 1 {
            strings.removeLast()
        } else if numberOfDeparturesNextDay >= 2 {
            strings.removeLast(2)
        }

        return strings
    }

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

    func gapInDaysFromNow(date: Date) -> Int {
        guard let gap = Calendar.current.dateComponents([.day], from: Date.now, to: date).day else {
            return 0
        }
        return gap
    }

    /// Returns the relevant departure times of the current departure
    func departures(numberOfDepartures: Int) -> [Date] {
        var times: [Date] = []
        let departures: [DepartureTime] = quayGroup?.group[0].departures ?? []
        var count = 0

        for departure in departures {
            if count < numberOfDepartures, departure.aimedTime > entryDate {
                times.append(departure.aimedTime)
                count += 1
            }
        }
        return times
    }
}
