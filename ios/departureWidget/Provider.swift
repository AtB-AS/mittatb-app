import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

struct Provider: TimelineProvider {
    private enum K {
        static var dummyEntry: Entry { Entry(date: Date.now, quayGroup: QuayGroup.dummy, isForPreview: true) }
        static let oneEntryTimeline = Timeline<Entry>(entries: [Entry(date: Date.now, quayGroup: nil)], policy: .after(Date.now.addingTimeInterval(5 * 60)))
    }

    private let apiService = APIService()
    private let locationManager = LocationChangeManager()

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> Entry {
        K.dummyEntry
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        completion(K.dummyEntry)
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        guard let favoriteDepartures = Manifest.data?.favoriteDepartures, let firstFavoriteDeparture = favoriteDepartures.first else {
            return completion(K.oneEntryTimeline)
        }

        // TODO: Cache the response!
        apiService.fetchLocations(quays: favoriteDepartures) { (result: Result<QuaysCoordinatesResponse, Error>) in
            switch result {
            case let .success(quaysCoordinatesResponse):
                locationManager.onLocationDidChange = { lastKnownLocation in
                    guard let lastKnownLocation = lastKnownLocation,
                          let closestQuay = findClosestQuay(quaysCoordinatesResponse.quays, at: lastKnownLocation),
                          let favoriteDeparture = favoriteDepartures.first(where: { $0.quayId == closestQuay.id }) else {
                        return fetchDepartures(departure: firstFavoriteDeparture, completion: completion)
                    }

                    return fetchDepartures(departure: favoriteDeparture, completion: completion)
                }
                locationManager.requestLocation()
                return
            case .failure:
                return fetchDepartures(departure: firstFavoriteDeparture, completion: completion)
            }
        }
    }

    /// Fetch departures for a given quay
    private func fetchDepartures(departure: FavoriteDeparture, completion: @escaping (Timeline<Entry>) -> Void) {
        // Fetch departure data for the closest favorite
        apiService.fetchDepartureTimes(departure: departure) { (result: Result<QuayGroup, Error>) in
            switch result {
            case let .success(quayGroup):

                guard let firstQuayGroup = quayGroup.group.first else {
                    return completion(K.oneEntryTimeline)
                }

                // Rerenders widget when a departure has passed, by giving IOS more information about future
                // dates we hopefully get better timed rerenders
                var entries = firstQuayGroup.departures.map { departure in Entry(date: departure.aimedTime, quayGroup: quayGroup) }

                entries.insert(Entry(date: Date.now, quayGroup: quayGroup), at: 0)

                // Remove the last entries so the view model has enough quays to show.
                if entries.count > 10 {
                    entries.removeLast(5)
                }

                return completion(Timeline(entries: entries, policy: .atEnd))

            case .failure:
                return completion(K.oneEntryTimeline)
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
