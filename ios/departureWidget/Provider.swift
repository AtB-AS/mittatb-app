import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    let locationManager = LocationManager()
    let apiService = APIService()

    var dateFiveMinutesAhead: Date {
        // Date 5 minutes ahead in time, 5 * 60seconds
        Date.now.addingTimeInterval(5 * 60)
    }

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> Entry {
        Entry(date: Date.now, quayGroup: QuayGroup.dummy)
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) {
        var entry = Entry(date: dateFiveMinutesAhead, quayGroup: QuayGroup.dummy)

        guard let favoriteDepartures = Manifest.data?.departures else {
            completion(entry)
            return
        }

        // shows dummy data if it is a preview
        if context.isPreview {
            completion(entry)
        }

        // Shows how the app will look for a user wih already defined favorites
        let closestDeparture = getClosestDeparture(favoriteDepartures)

        apiService.fetchDepartureTimes(departure: closestDeparture) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(object):
                entry = Entry(date: dateFiveMinutesAhead, quayGroup: object)
                completion(entry)
            case .failure:
                return
            }
        }
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        // Empty timeline to use in case of error
        var timeline = Timeline(entries: [Entry(date: dateFiveMinutesAhead, quayGroup: nil)], policy: .atEnd)

        // Get favorites, if none return empty Entry
        guard let favoriteDepartures = Manifest.data?.departures else {
            completion(timeline)
            return
        }

        let closestDeparture = getClosestDeparture(favoriteDepartures)

        // Fetch departure data for the closest favorite
        apiService.fetchDepartureTimes(departure: closestDeparture) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(quayGroup):

                guard let firstQuayGroup = quayGroup.group.first else {
                    completion(timeline)
                    return
                }

                /*
                 Rerenders widget when a departure has passed, by giving IOS more information about future
                 dates we hopefully get better timed rerenders

                 This also relies on that location change asks for a new timeline, and not just rerenders
                 */
                var entries: [Entry] = []

                // TODO: find out if location updates requests new timeline or only renders widget
                for departure in firstQuayGroup.departures {
                  
                    
                    let entry = Entry(date: departure.aimedTime, quayGroup: quayGroup)
                    entries.append(entry)
                }

                timeline = Timeline(entries: entries, policy: .atEnd)
                completion(timeline)

            case .failure:
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
