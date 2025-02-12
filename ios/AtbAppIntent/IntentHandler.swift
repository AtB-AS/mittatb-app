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
        guard let favoriteDepartures = Manifest.data?.favouriteDepartures else {
            return
        }

        let quays = (Dictionary(grouping: favoriteDepartures) { $0.quayName })

        var sections: [INObjectSection<FavoriteDeparture>] = []

        // iterates the keys sorted alphabetically
        quays.keys.sorted(by: { $0 < $1 }).forEach { quay in

            if let departures = quays[quay] {
                let options: [FavoriteDeparture] = departures.map { departure in

                    let favoriteDeparture = FavoriteDeparture(
                        identifier: departure.id,
                        display: "\(departure.lineLineNumber) \(departure.destinationDisplay?.frontText ?? NSLocalizedString("all_variations", comment: ""))"
                    )

                    return favoriteDeparture
                }

                sections.append(INObjectSection(title: quay, items: options))
            }
        }

        sections.insert(INObjectSection(title: nil, items: [myPositionOption]), at: 0)

        let collection = INObjectCollection(sections: sections)

        completion(collection, nil)
    }

    func defaultFavoriteDeparture(for _: UseLocationIntent) -> FavoriteDeparture? {
        myPositionOption
    }
}
