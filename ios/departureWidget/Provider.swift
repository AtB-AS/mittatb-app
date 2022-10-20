import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    let locationManager = LocationManager()
    let apiService = APIService()

    func placeholder(in _: Context) -> Entry {
        Entry(date: Date(), quayGroup: nil)
    }

    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        let entry = Entry(date: Date(), quayGroup: nil)
        completion(entry)
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        guard let departures = Manifest.data?.departures else {
            return
        }

        let closestDeparture = getClosestDeparture(departures)

        let date = Calendar.current.date(byAdding: .minute, value: 5, to: Date())!

        apiService.fetchFavoriteDepartures(favorite: closestDeparture) { (result: Result<DepartureGroup, Error>) in

            switch result {
            case let .success(object):
                // TODO: Object `Entry` is expecting a `quayGroup` not `departureGroup`
                let timeline = Timeline(entries: [Entry(date: date, quayGroup: nil)], policy: .atEnd)
                completion(timeline)
            case .failure:
                return
            }
        }
    }

    func getClosestDeparture(_ departures: [DepartureLine]) -> DepartureLine {
        var closestDeparture: DepartureLine = departures[0]
        var smallestDistance: CLLocationDistance?

        for departure in departures {
            let distance = departure.location.distance(from: locationManager.lastLocation ?? CLLocation(latitude: 63.43457, longitude: 10.39844))
            if smallestDistance == nil || distance < smallestDistance! {
                closestDeparture = departure
                smallestDistance = distance
            }
        }

        return closestDeparture
    }
}
