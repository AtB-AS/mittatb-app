import CoreLocation
import Foundation
import WidgetKit

struct DepartureData: Codable {
    let data: [StopPlaceGroup]
}

struct StopPlaceGroup: Codable {
    let stopPlace: StopPlaceInfo
    let quays: [QuayGroup]
}

struct StopPlaceInfo: Codable {
    var __typename: String
    let id: String
    let description: String?
    let name: String
    let latitude: Double
    let longitude: Double
}

struct QuayGroup: Codable {
    let quay: QuayInfo
    let group: [DepartureGroup]
}

struct QuayInfo: Codable {
    let __typename: String
    let id: String
    let name: String
    let description: String?
    let publicCode: String
    let latitude: Double
    let longitude: Double
}

struct DepartureGroup: Codable {
    let lineInfo: DepartureLineInfo
    let departures: [DepartureTime]
}

struct DepartureLineInfo: Codable {
    let lineId: String
    let lineName: String?
    let lineNumber: String
    let transportMode: String
    let transportSubmode: String
    let quayId: String
}

struct DepartureTime: Codable {
    let time: Date
    let aimedTime: Date
    let predictionInaccurate: Bool
    let realtime: Bool
    let situations: [String]
    let serviceJourneyId: String
}

struct Entry: TimelineEntry {
    let date: Date
    let quayGroup: QuayGroup?
}

/// Struct for favorite departures stored on device
struct FavoriteDeparture: Codable {
    let id: String
    let lineId: String
    let lineName: String?
    let lineLineNumber: String
    let lineTransportationMode: String
    let lineTransportationSubMode: String
    let longitude: Double
    let latitude: Double
    let quayName: String
    let quayPublicCode: String
    let quayId: String
    let stopId: String

    var location: CLLocation {
        CLLocation(latitude: latitude, longitude: longitude)
    }
}
