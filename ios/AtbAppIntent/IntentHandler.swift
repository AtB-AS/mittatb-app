import Intents
import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

class IntentHandler: INExtension, UseLocationIntentHandling {
  
    func provideFavoriteDepartureOptionsCollection(for intent: UseLocationIntent, with completion: @escaping (INObjectCollection<FavoriteDeparture>?, Error?) -> Void) {
      
        // No favorite departures
      guard let favoriteDepartures = Manifest.data?.favouriteDepartures else {
            return
        }
      
        
        var options: [FavoriteDeparture] = favoriteDepartures.map { departure in
            let favoriteDeparture = FavoriteDeparture(
                identifier: departure.id,
                display: departure.lineLineNumber + " fra " + departure.quayName
            )

            return favoriteDeparture
        }
      
      let position = FavoriteDeparture(
          identifier: "0",
          display: "Min posisjon"
      )
      
    
      options.insert(position, at: 0)
      
    

        let collection = INObjectCollection(items: options)
      

        completion(collection, nil)
      
      
    }
}
