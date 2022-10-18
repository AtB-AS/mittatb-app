import Foundation

class ViewModel : ObservableObject{
  private struct K {
    static let defaultLineName = "N/A"
    static let defaultLineNumber = "N/A"
  }
  
  private let quayGroup : QuayGroup
  
  init(quayGroup: QuayGroup) {
    self.quayGroup = quayGroup
  }
  
  var quayName : String{
    return quayGroup.quay.name
  }
  
  var lineInfo : DepartureLineInfo? {
    return quayGroup.group.first?.lineInfo
  }
  
  var lineName : String {
    return lineInfo?.lineName ?? K.defaultLineName
  }
  
  var lineNumber : String {
    return lineInfo?.lineNumber ?? K.defaultLineNumber
  }
  
  var departures : [DepartureTime] {
    return quayGroup.group[0].departures
  }
}

