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

    /// The placeholder is shown in transitions and while loading the snapshot when adding the widget to the home screen
    func placeholder(in _: Context) -> Entry {
        K.dummyEntry
    }

    /// The snapshot shows is used to preview the widget when adding it to the home screen
    func getSnapshot(in _: Context, completion: @escaping (Entry) -> Void) {
        completion(K.dummyEntry)
    }

    func getTimeline(in _: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        guard let favoriteDepartures = Manifest.data?.favoriteDepartures else {
            return completion(K.oneEntryTimeline)
        }

        apiService.fetchLocations(quays: favoriteDepartures) { (result: Result<[QuayWithLocation], Error>) in
            switch result {
            case let .success(quays):

                guard let closestQuay = findClosestQuay(quays) else {
                    return completion(K.oneEntryTimeline)
                }

                guard let closestFavorite = favoriteDepartures.first(where: { $0.quayId == closestQuay.id }) else {
                    return completion(K.oneEntryTimeline)
                }

                fetchDepartures(departure: closestFavorite, completion: completion)

            case .failure:
                return completion(K.oneEntryTimeline)
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

                // Remove last entries so that the viewmodel always has enough quays to show.
                if entries.count > 10 {
                    entries.removeLast(5)
                }

                return completion(Timeline(entries: entries, policy: .atEnd))

            case .failure:
                return completion(K.oneEntryTimeline)
            }
        }
    }

    /// Finds the closest favorite departure based on current location on the user
    private func findClosestQuay(_ departures: [QuayWithLocation]) -> QuayWithLocation? {
        if let currentLocation = LocationChangeManager.shared.lastKnownLocation {
            return departures.min {
                $0.location.distance(from: currentLocation) < $1.location.distance(from: currentLocation)
            }
        }

        return departures.first
    }
}
