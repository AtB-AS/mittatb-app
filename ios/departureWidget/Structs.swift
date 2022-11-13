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
    var departures: [DepartureTime]
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

extension FavoriteDeparture {
    static let dummy: FavoriteDeparture = .init(
        id: "",
        lineId: "ATB:Line:2_2",
        lineName: "Ranheim",
        lineLineNumber: "1",
        lineTransportationMode: "bus",
        lineTransportationSubMode: "bus",
        longitude: 0,
        latitude: 0,
        quayName: "Prinsens gate",
        quayPublicCode: "P1",
        quayId: "NSR:Quay:71184",
        stopId: "NSR:StopPlace:41613"
    )
}

extension QuayGroup {
    static let dummy: QuayGroup = .init(
        quay:
        QuayInfo(
            __typename: "",
            id: "",
            name: "Solsiden",
            description: nil,
            publicCode: "",
            latitude: 63.43457,
            longitude: 10.39844
        ),
        group: [
            DepartureGroup(
                lineInfo:
                DepartureLineInfo(
                    lineId: "",
                    lineName: "Kattem via sentrum-Tiller",
                    lineNumber: "1",
                    transportMode: "bus",
                    transportSubmode: "bus",
                    quayId: ""
                ),
                departures: [
                    DepartureTime(
                        time: Date.now,
                        aimedTime: Date.now,
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    ),
                    DepartureTime(
                        time: Date.now.addingTimeInterval(6 * 100),
                        aimedTime: Date.now.addingTimeInterval(6 * 100),
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    ),
                    DepartureTime(
                        time: Date.now.addingTimeInterval(12 * 100),
                        aimedTime: Date.now.addingTimeInterval(12 * 100),
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    ),
                    DepartureTime(
                        time: Date.now.addingTimeInterval(18 * 100),
                        aimedTime: Date.now.addingTimeInterval(18 * 100),
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    ),
                    DepartureTime(
                        time: Date.now.addingTimeInterval(24 * 100),
                        aimedTime: Date.now.addingTimeInterval(24 * 100),
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    ),
                    DepartureTime(
                        time: Date.now.addingTimeInterval(30 * 100),
                        aimedTime: Date.now.addingTimeInterval(30 * 100),
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    ),
                ]
            ),
        ]
    )
}
