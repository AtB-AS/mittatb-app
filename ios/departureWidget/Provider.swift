import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    let locationManager = LocationManager()
    let apiService = APIService()

    func placeholder(in _: Context) -> Entry {
        //TODO: create placeholder
        Entry(date: Date(), quayGroup: nil)
    }

    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        //TODO: create snapshot
        let entry = Entry(date: Date(), quayGroup: nil)
        completion(entry)
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
      
        //TODO: update manifest for each timeline entry incase a user updates favorites
        guard let favoriteDepartures = Manifest.data?.departures else {
            return
        }

        //TODO: if no favorites
        let closestDeparture = getClosestDeparture(favoriteDepartures)

        let date = Calendar.current.date(byAdding: .minute, value: 5, to: Date())!

        apiService.fetchFavoriteDepartures(favorite: closestDeparture) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(object):
                let timeline = Timeline(entries: [Entry(date: date, quayGroup: object)], policy: .atEnd)
                completion(timeline)
            case .failure:
                return
            }
        }
    }

    /**
     Finds the closest favorite departure based on current location on the user
     */
    func getClosestDeparture(_ departures: [FavoriteDeparture]) -> FavoriteDeparture {
      var closestDeparture: FavoriteDeparture = departures.first!
        var smallestDistance: CLLocationDistance?

        for departure in departures {
            //TODO: better solution for default location
            let distance = departure.location.distance(from: locationManager.lastLocation ?? CLLocation(latitude: 63.43457, longitude: 10.39844))
            if smallestDistance == nil || distance < smallestDistance! {
                closestDeparture = departure
                smallestDistance = distance
            }
        }

        return closestDeparture
    }
}
