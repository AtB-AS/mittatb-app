import Foundation

class ViewModel: ObservableObject {
    private enum K {
        static let defaultLineName = "N/A"
        static let defaultLineNumber = "N/A"
    }

    private let quayGroup: QuayGroup

    init(quayGroup: QuayGroup) {
        self.quayGroup = quayGroup
    }

    var quayName: String {
        quayGroup.quay.name
    }

    var lineInfo: DepartureLine? {
        quayGroup.group.first?.lineInfo
    }

    var lineName: String {
        lineInfo?.lineName ?? K.defaultLineName
    }

    var lineNumber: String {
        lineInfo?.lineLineNumber ?? K.defaultLineNumber
    }

    var departures: [DepartureTime] {
        quayGroup.group[0].departures
    }
}
