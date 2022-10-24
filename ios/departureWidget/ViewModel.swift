import Foundation

class ViewModel: ObservableObject {
    private enum K {
        static let defaultLineName = "N/A"
        static let defaultLineNumber = "N/A"
        static let defaultQuayName = "N/A"
    }
  
    var hasData = false

    private let quayGroup: QuayGroup?
  
    init(quayGroup: QuayGroup?) {
      self.quayGroup = quayGroup
      
      if(quayGroup != nil){ hasData = true }
    }

    var quayName: String {
        quayGroup?.quay.name ?? K.defaultQuayName
    }

    var lineInfo: DepartureLineInfo? {
        quayGroup?.group.first?.lineInfo
    }

    var lineName: String {
        lineInfo?.lineName ?? K.defaultLineName
    }

    var lineNumber: String {
        lineInfo?.lineNumber ?? K.defaultLineNumber
    }

  /**
   Returns the times of the current departure
   */
    var departures: [Date] {
      var times : [Date] = []
      for departure in quayGroup?.group[0].departures.prefix(upTo: 2) ?? [] {
        times.append(departure.aimedTime)
      }
      return times
    }
}
