import Foundation
import WidgetKit

class ViewModel: ObservableObject {
    // TODO: show what fields the view model is containing
    private enum K {
        static let defaultLineName = "N/A"
        static let defaultLineNumber = "N/A"
        static let defaultQuayName = "N/A"
    }

    private let quayGroup: QuayGroup?
    private let date: Date

    init(quayGroup: QuayGroup?, date: Date) {
        self.quayGroup = quayGroup
        self.date = date
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

    /// Returns the relevant departure times of the current departure
    func departures(numberOfdepartures: Int) -> [Date] {
        var times: [Date] = []
        let departures: [DepartureTime] = quayGroup?.group[0].departures ?? []
        var count = 0

        for departure in departures {
            if count < numberOfdepartures, departure.aimedTime >= date {
                times.append(departure.aimedTime)
                count += 1
            }
        }

        return times
    }
}
