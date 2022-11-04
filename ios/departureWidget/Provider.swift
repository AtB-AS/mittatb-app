import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    private enum K {
        static var dummyEntry: Entry { Entry(date: Date.now, quayGroup: QuayGroup.dummy) }
        static let emptyTimeline = Timeline<Entry>(entries: [], policy: .atEnd)
    }

    let locationManager = LocationManager()
    let apiService = APIService()

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> Entry {
        K.dummyEntry
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        completion(K.dummyEntry)
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        guard let favoriteDepartures = Manifest.data?.favoriteDepartures, let closestDeparture = findClosestDeparture(favoriteDepartures) else {
            return completion(K.emptyTimeline)
        }

        // Fetch departure data for the closest favorite
        apiService.fetchDepartureTimes(departure: closestDeparture) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(quayGroup):
                guard let firstQuayGroup = quayGroup.group.first else {
                    return completion(K.emptyTimeline)
                }

                // Rerenders widget when a departure has passed, by giving IOS more information about future
                // dates we hopefully get better timed rerenders
                // This also relies on that location change asks for a new timeline, and not just rerenders
                // TODO: find out if location updates requests new timeline or only renders widget
                let entries = firstQuayGroup.departures.map { departure in Entry(date: departure.aimedTime, quayGroup: quayGroup) }
                return completion(Timeline(entries: entries, policy: .atEnd))
            case .failure:
                return completion(K.emptyTimeline)
            }
        }
    }

    /// Finds the closest favorite departure based on current location on the user
    private func findClosestDeparture(_ departures: [FavoriteDeparture]) -> FavoriteDeparture? {
        var closestDeparture: FavoriteDeparture? = departures.first
        var smallestDistance: CLLocationDistance?

        for departure in departures {
            let distance = departure.location.distance(from: locationManager.lastLocation ?? locationManager.defaultLocation)
            if smallestDistance == nil || distance < smallestDistance! {
                closestDeparture = departure
                smallestDistance = distance
            }
        }

        return closestDeparture
    }
}
