//
//  ViewModel.swift
//  departureWidgetExtension
//
//  Created by Adrian Hakvåg on 18/10/2022.
//

import Foundation


class ViewModel : ObservableObject{
  
  private let quayGroup : QuayGroup
  
  init(quayGroup: QuayGroup) {
    self.quayGroup = quayGroup
  }
  
  var quayName : String{
    return quayGroup.quay.name
  }
  
  var lineInfo : DepartureLineInfo{
    return quayGroup.group[0].lineInfo
  }
  
  var lineName : String{
    return lineInfo.lineName
  }
  
  var lineNumber : String{
    return lineInfo.lineNumber
  }
  
  var departures : [DepartureTime]{
    return quayGroup.group[0].departures
  }
}

