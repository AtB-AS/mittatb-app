import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: IntentTimelineProvider {
    private enum K {
        static var previewEntry: DepartureWidgetEntry { Entry(date: Date.now, favouriteDeparture: FavouriteDeparture.dummy, stopPlaceGroup: StopPlaceGroup.dummy, departures: nil, state: .preview) }
        static let noFavouritesTimeline = Timeline<Entry>(entries: [Entry(date: Date.now, favouriteDeparture: nil, stopPlaceGroup: nil, departures: nil, state: .noFavouriteDepartures)], policy: .never)
    }

    private let apiService = APIService()
    private let locationManager = LocationChangeManager()

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> DepartureWidgetEntry {
        K.previewEntry
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(for _: UseLocationIntent, in _: Context, completion: @escaping (DepartureWidgetEntry) -> Void) {
        completion(K.previewEntry)
    }

    func getTimeline(for intent: UseLocationIntent, in _: Context, completion: @escaping (Timeline<DepartureWidgetEntry>) -> Void) {
        // No favorite departures
        guard let favoriteDepartures = Manifest.data?.favouriteDepartures,
              let firstFavoriteDeparture = favoriteDepartures.first,
              let intentDeparture = intent.FavoriteDeparture else {
            return completion(K.noFavouritesTimeline)
        }

        if intentDeparture.identifier != "showClosest" {
            guard let chosenFavoriteDeparture = favoriteDepartures.first(where: { $0.id == intentDeparture.identifier }) else {
                return completion(K.noFavouritesTimeline)
            }
            fetchFavouriteDepartureTimes(favouriteDeparture: chosenFavoriteDeparture, completion: completion)
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
        let noDeparturesTimeline = Timeline<Entry>(entries: [Entry(date: Date.now, favouriteDeparture: departure, stopPlaceGroup: nil, departures: nil, state: .noDepartureQuays)], policy: .after(Date.now.addingTimeInterval(5 * 60)))
        // Fetch departure data for the closest favorite
        apiService.fetchFavouriteDepartureTimes(favouriteDeparture: departure) { (result: Result<StopPlaceGroup, Error>) in
            switch result {
            case let .success(stopPlaceGroup):

                guard let quayGroup = stopPlaceGroup.quays.first(where: { $0.quay.id == departure.quayId }) else {
                    return completion(noDeparturesTimeline)
                }
                var departures: [DepartureTime] = []

                if departure.destinationDisplay?.frontText == nil {
                    quayGroup.group.forEach { line in
                        departures.append(contentsOf: line.departures)
                    }
                } else {
                    guard let lineDepartures = quayGroup.group.first(where: { $0.lineInfo.destinationDisplay?.frontText == departure.destinationDisplay?.frontText })?.departures else {
                        return completion(noDeparturesTimeline)
                    }
                    departures = lineDepartures
                }

                departures = departures.sorted(by: { $0.aimedTime.compare($1.aimedTime) == .orderedAscending })

                // Rerenders widget when a departure has passed, by giving IOS more information about future
                // dates we hopefully get better timed rerenders
                // Rerenders widget 1 minute after departure have passed
                var entries = departures.map { departureTime in Entry(date: departureTime.aimedTime.addingTimeInterval(60), favouriteDeparture: departure, stopPlaceGroup: stopPlaceGroup, departures: departures, state: .complete) }

                entries.insert(Entry(date: Date.now, favouriteDeparture: departure, stopPlaceGroup: stopPlaceGroup, departures: departures, state: .complete), at: 0)

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
                return completion(noDeparturesTimeline)
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
