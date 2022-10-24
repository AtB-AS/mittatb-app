import Foundation

class ViewModel: ObservableObject {
    // TODO: show what fields the view model is containing
    private enum K {
        static let defaultLineName = "N/A"
        static let defaultLineNumber = "N/A"
        static let defaultQuayName = "N/A"
    }

    var hasData = false

    private let quayGroup: QuayGroup?

    init(quayGroup: QuayGroup?) {
        self.quayGroup = quayGroup

        if quayGroup != nil { hasData = true }
    }

    var quayName: String? {
        quayGroup?.quay.name
    }

    var lineInfo: DepartureLineInfo? {
        quayGroup?.group.first?.lineInfo
    }

    var lineName: String {
        lineInfo?.lineName
    }

    var lineNumber: String? {
        lineInfo?.lineNumber
    }

    /**
     Returns the times of the current departure
     */
    var departures: [Date] {
        var times: [Date] = []
        for departure in quayGroup?.group[0].departures.prefix(upTo: 2) ?? [] {
            times.append(departure.aimedTime)
        }
        return times
    }
}
