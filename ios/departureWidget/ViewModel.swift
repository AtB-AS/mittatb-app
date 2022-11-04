import Foundation

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
    var departures: [Date] {
        var times: [Date] = []

        var departures: [DepartureTime] = quayGroup?.group[0].departures ?? []
    
        departures.removeAll(where: { $0.aimedTime < Date.now })

        for departure in departures.prefix(upTo: 2) {
            times.append(departure.aimedTime)
        }
        return times
    }
}
