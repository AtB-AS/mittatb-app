import CoreLocation
import Foundation
import Intents
import SwiftUI
import WidgetKit

class IntentHandler: INExtension, UseLocationIntentHandling {
    private let myPositionOption = FavoriteDeparture(
        identifier: "showClosest",
        display: NSLocalizedString("show_closest", comment: "")
    )

    func provideFavoriteDepartureOptionsCollection(for _: UseLocationIntent, with completion: @escaping (INObjectCollection<FavoriteDeparture>?, Error?) -> Void) {
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

        options.insert(myPositionOption, at: 0)

        let collection = INObjectCollection(items: options)

        completion(collection, nil)
    }

    func defaultFavoriteDeparture(for _: UseLocationIntent) -> FavoriteDeparture? {
        myPositionOption
    }
}
