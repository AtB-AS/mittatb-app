import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    private enum K {
        static var previewEntry: Entry { Entry(date: Date.now, favouriteDeparture: FavouriteDeparture.dummy, stopPlaceGroup: StopPlaceGroup.dummy, state: .preview) }
        static let noFavouritesTimeline = Timeline<Entry>(entries: [Entry(date: Date.now, favouriteDeparture: nil, stopPlaceGroup: nil, state: .noFavouriteDepartures)], policy: .never)
    }

    private let apiService = APIService()
    private let locationManager = LocationChangeManager()

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> Entry {
        K.previewEntry
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        completion(K.previewEntry)
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        // No favorite departures
        guard let favoriteDepartures = Manifest.data?.favouriteDepartures,
              let firstFavoriteDeparture = favoriteDepartures.first
        else {
            return completion(K.noFavouritesTimeline)
        }

        apiService.fetchQuayCoordinates(favouriteDepartures: favoriteDepartures) { (result: Result<QuaysCoordinatesResponse, Error>) in
            switch result {
            case let .success(quaysCoordinatesResponse):
                locationManager.requestLocation { lastKnownLocation in
                    guard let lastKnownLocation = lastKnownLocation,
                          let closestQuay = findClosestQuay(quaysCoordinatesResponse.quays, at: lastKnownLocation),
                          let closestFavouriteDeparture = favoriteDepartures.first(where: { $0.quayId == closestQuay.id }) else {
                        return fetchFavouriteDepartureTimes(favouriteDeparture: firstFavoriteDeparture, completion: completion)
                    }

                    return fetchFavouriteDepartureTimes(favouriteDeparture: closestFavouriteDeparture, completion: completion)
                }
                return
            case .failure:
                return fetchFavouriteDepartureTimes(favouriteDeparture: firstFavoriteDeparture, completion: completion)
            }
        }
    }

    /// Fetch departures for a given quay
    private func fetchFavouriteDepartureTimes(favouriteDeparture departure: FavouriteDeparture, completion: @escaping (Timeline<Entry>) -> Void) {
        // Fetch departure data for the closest favorite
        apiService.fetchFavouriteDepartureTimes(favouriteDeparture: departure) { (result: Result<StopPlaceGroup, Error>) in
            switch result {
            case let .success(stopPlaceGroup):

                guard let firstQuayGroup = stopPlaceGroup.quays.first(where: { $0.quay.id == departure.quayId })?.group.first else {
                    return completion(Timeline<Entry>(entries: [Entry(date: Date.now, favouriteDeparture: departure, stopPlaceGroup: nil, state: .noDepartureQuays)], policy: .after(Date.now.addingTimeInterval(5 * 60))))
                }

                // Rerenders widget when a departure has passed, by giving IOS more information about future
                // dates we hopefully get better timed rerenders
                var entries = firstQuayGroup.departures.map { departureTime in Entry(date: departureTime.aimedTime, favouriteDeparture: departure, stopPlaceGroup: stopPlaceGroup, state: .complete) }

                entries.insert(Entry(date: Date.now, favouriteDeparture: departure, stopPlaceGroup: stopPlaceGroup, state: .complete), at: 0)

                // Remove the last entries so the view model has enough quays to show.
                if entries.count > 10 {
                    entries.removeLast(5)
                }

                // Making it so that the timeline refreshes at midnight
                let currentDate = Date()
                let midnight = Calendar.current.startOfDay(for: currentDate)
                let nextMidnight = Calendar.current.date(byAdding: .day, value: 1, to: midnight)!

                return completion(Timeline(entries: entries, policy: .after(nextMidnight)))

            case .failure:
                return completion(Timeline(entries: [Entry(date: Date.now, favouriteDeparture: departure, stopPlaceGroup: nil, state: .noDepartureQuays)], policy: .after(Date.now.addingTimeInterval(5 * 60))))
            }
        }
    }

    /// Finds the closest quay based on the user `current location`
    private func findClosestQuay(_ quays: [QuayWithLocation], at location: CLLocation) -> QuayWithLocation? {
        quays.min {
            $0.location.distance(from: location) < $1.location.distance(from: location)
        }
    }
}
