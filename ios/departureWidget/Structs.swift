import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

// MARK: Enums

enum TransportMode: String, Codable {
    case water, rail, tram, bus

    var icon: Image {
        switch self {
        case .water:
            return Image("BoatIcon")
        case .rail:
            return Image("TrainIcon")
        case .tram:
            return Image("TramIcon")
        case .bus:
            return Image("BusIcon")
        }
    }
}

enum TransportSubMode: String, Codable {
    case regionBus, nightBus

    var icon: Image {
        switch self {
        case .regionBus, .nightBus:
            return Image("RegionBusIcon")
        }
    }
}

// MARK: Structs

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
    let transportMode: TransportMode?
    let transportSubmode: TransportSubMode?
    let quayId: String

    init(lineId: String, lineName: String?, lineNumber: String, transportMode: TransportMode?, transportSubmode: TransportSubMode?, quayId: String) {
        self.lineId = lineId
        self.lineName = lineName
        self.lineNumber = lineNumber
        self.transportMode = transportMode
        self.transportSubmode = transportSubmode
        self.quayId = quayId
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        lineId = try container.decode(String.self, forKey: .lineId)
        lineName = try container.decodeIfPresent(String.self, forKey: .lineName)
        lineNumber = try container.decode(String.self, forKey: .lineNumber)
        transportMode = try? container.decodeIfPresent(TransportMode.self, forKey: .transportMode)
        transportSubmode = try? container.decodeIfPresent(TransportSubMode.self, forKey: .transportSubmode)
        quayId = try container.decode(String.self, forKey: .quayId)
    }
}

struct DepartureTime: Codable {
    let time: Date
    let aimedTime: Date
    let predictionInaccurate: Bool
    let realtime: Bool
    let situations: [String]
    let serviceJourneyId: String
}

struct Body: Codable {
    let favorites: [FavoriteDeparture]
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
    let lineTransportationMode: TransportMode?
    let lineTransportationSubMode: TransportSubMode?
    let longitude: Double
    let latitude: Double
    let quayName: String
    let quayPublicCode: String
    let quayId: String
    let stopId: String

    var location: CLLocation {
        CLLocation(latitude: latitude, longitude: longitude)
    }

    init(id: String, lineId: String, lineName: String?, lineLineNumber: String, lineTransportationMode: TransportMode?, lineTransportationSubMode: TransportSubMode?, longitude: Double, latitude: Double, quayName: String, quayPublicCode: String, quayId: String, stopId: String) {
        self.id = id
        self.lineId = lineId
        self.lineName = lineName
        self.lineLineNumber = lineLineNumber
        self.lineTransportationMode = lineTransportationMode
        self.lineTransportationSubMode = lineTransportationSubMode
        self.longitude = longitude
        self.latitude = latitude
        self.quayName = quayName
        self.quayPublicCode = quayPublicCode
        self.quayId = quayId
        self.stopId = stopId
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        lineId = try container.decode(String.self, forKey: .lineId)
        lineName = try container.decodeIfPresent(String.self, forKey: .lineName)
        lineLineNumber = try container.decode(String.self, forKey: .lineLineNumber)
        lineTransportationMode = try? container.decodeIfPresent(TransportMode.self, forKey: .lineTransportationMode)
        lineTransportationSubMode = try? container.decodeIfPresent(TransportSubMode.self, forKey: .lineTransportationSubMode)
        longitude = try container.decode(Double.self, forKey: .longitude)
        latitude = try container.decode(Double.self, forKey: .latitude)
        quayName = try container.decode(String.self, forKey: .quayName)
        quayPublicCode = try container.decode(String.self, forKey: .quayPublicCode)
        quayId = try container.decode(String.self, forKey: .quayId)
        stopId = try container.decode(String.self, forKey: .stopId)
    }
}

// MARK: Extensions

extension FavoriteDeparture {
    static let dummy: FavoriteDeparture = .init(
        id: "",
        lineId: "ATB:Line:2_2",
        lineName: "Ranheim",
        lineLineNumber: "1",
        lineTransportationMode: TransportMode.bus,
        lineTransportationSubMode: TransportSubMode.nightBus,
        longitude: 0,
        latitude: 0,
        quayName: "Prinsens gate",
        quayPublicCode: "P1",
        quayId: "NSR:Quay:71184",
        stopId: "NSR:StopPlace:41613"
    )
}

extension QuayGroup {
    static let dummy = QuayGroup(
        quay: QuayInfo(
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
                    transportMode: TransportMode.bus,
                    transportSubmode: TransportSubMode.nightBus,
                    quayId: ""
                ),
                departures: [Int](0 ..< 5).map { index in
                    let timeInterval = CGFloat(index) * 500
                    let timeDate = Date.now.addingTimeInterval(timeInterval)
                    return DepartureTime(
                        time: timeDate,
                        aimedTime: timeDate,
                        predictionInaccurate: false,
                        realtime: false,
                        situations: [],
                        serviceJourneyId: ""
                    )
                }
            ),
        ]
    )
}
