//
//  data.swift
//  departureWidgetExtension
//
//  Created by Adrian Hakvåg on 17/10/2022.
//

import Foundation
import CoreLocation


struct Favorite: Codable{
    let stopId : String
    let quayId : String
    let lineId : String
    let lineName: String
    let longitude : Double
    let latitude: Double
    
  
    func getLocation() -> CLLocation{
      return CLLocation(latitude: latitude, longitude: longitude)
    }

}
