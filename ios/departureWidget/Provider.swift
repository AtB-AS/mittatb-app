import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    let locationManager = LocationManager()
    let apiService = APIService()

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> Entry {
        Entry(date: Date(), quayGroup: QuayGroup.dummy)
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        let date = Calendar.current.date(byAdding: .minute, value: 5, to: Date())!

        // if no favorites, show dummy data so the user still gets a preview
        guard let favoriteDepartures = Manifest.data?.departures else {
            let entry = Entry(date: date, quayGroup: QuayGroup.dummy)
            completion(entry)
            return
        }

        let closestDeparture = getClosestDeparture(favoriteDepartures)

        apiService.fetchDepartureTimes(departure: closestDeparture) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(object):
                let entry = Entry(date: date, quayGroup: object)
                completion(entry)
            case .failure:
                return
            }
        }
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        let date = Calendar.current.date(byAdding: .minute, value: 5, to: Date())!

        // Get favorites, if none return empty Entry
        guard let favoriteDepartures = Manifest.data?.departures else {
            let timeline = Timeline(entries: [Entry(date: date, quayGroup: nil)], policy: .atEnd)
            completion(timeline)
            return
        }

        let closestDeparture = getClosestDeparture(favoriteDepartures)

        // Fetch departure data for the closest favorite
        apiService.fetchDepartureTimes(departure: closestDeparture) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(quayGroup):

                var entries: [Entry] = []

                /*
                  Rerenders widget when a departure has passed, by giving IOS more information about future
                  dates we hopefully get better timed rerenders

                  This also relies on that location change asks for a new timeline, and not jst rerenders
                 */

                // TODO: find out if location updates requests new timeline or only renders widget
                for departure in quayGroup.group.first!.departures {
                    let entry = Entry(date: departure.aimedTime, quayGroup: quayGroup)
                    entries.append(entry)
                }

                let timeline = Timeline(entries: entries, policy: .atEnd)
                completion(timeline)

            case .failure:
                let timeline = Timeline(entries: [Entry(date: date, quayGroup: nil)], policy: .atEnd)
                completion(timeline)
                return
            }
        }
    }

    /// Finds the closest favorite departure based on current location on the user
    func getClosestDeparture(_ departures: [FavoriteDeparture]) -> FavoriteDeparture {
        var closestDeparture: FavoriteDeparture = departures.first!
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
