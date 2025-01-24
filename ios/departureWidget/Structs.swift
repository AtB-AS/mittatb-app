import CoreLocation
import Foundation
import SwiftUI
import WidgetKit

// MARK: Enums

enum TransportMode: String, Codable {
    case air,
         bus,
         cableway,
         coach,
         funicular,
         lift,
         metro,
         monorail,
         rail,
         tram,
         trolleybus,
         unknown,
         water

    var icon: Image? {
        switch self {
        case .water:
            return Image("Boat")
        case .rail:
            return Image("Train")
        case .tram:
            return Image("Tram")
        case .bus:
            return Image("Bus")
        case .metro:
            return Image("Metro")
        default:
            return nil
        }
    }

    var iconForegroundColor: Color {
        switch self {
        case .rail, .metro:
            return .white
        default:
            return .black
        }
    }

    var iconBackgroundColor: Color {
        switch self {
        case .water:
            return Color("Transport/Boat")
        case .rail, .metro:
            return Color("Transport/Train")
        default:
            return Color("Transport/City")
        }
    }
}

enum TransportSubMode: String, Codable {
    case schengenAreaFlight,
         airportBoatLink,
         airportLinkBus,
         airportLinkRail,
         airshipService,
         allFunicularServices,
         allHireVehicles,
         allTaxiServices,
         bikeTaxi,
         blackCab,
         cableCar,
         cableFerry,
         canalBarge,
         carTransportRailService,
         chairLift,
         charterTaxi,
         cityTram,
         communalTaxi,
         commuterCoach,
         crossCountryRail,
         dedicatedLaneBus,
         demandAndResponseBus,
         domesticCharterFlight,
         domesticFlight,
         domesticScheduledFlight,
         dragLift,
         expressBus,
         funicular,
         helicopterService,
         highFrequencyBus,
         highSpeedPassengerService,
         highSpeedRail,
         highSpeedVehicleService,
         hireCar,
         hireCycle,
         hireMotorbike,
         hireVan,
         intercontinentalCharterFlight,
         intercontinentalFlight,
         international,
         internationalCarFerry,
         internationalCharterFlight,
         internationalCoach,
         internationalFlight,
         internationalPassengerFerry,
         interregionalRail,
         lift,
         local,
         localBus,
         localCarFerry,
         localPassengerFerry,
         localTram,
         longDistance,
         metro,
         miniCab,
         mobilityBus,
         mobilityBusForRegisteredDisabled,
         nationalCarFerry,
         nationalCoach,
         nationalPassengerFerry,
         nightBus,
         nightRail,
         postBoat,
         postBus,
         rackAndPinionRailway,
         railReplacementBus,
         railShuttle,
         railTaxi,
         regionalBus,
         regionalCarFerry,
         regionalCoach,
         regionalPassengerFerry,
         regionalRail,
         regionalTram,
         replacementRailService,
         riverBus,
         roadFerryLink,
         roundTripCharterFlight,
         scheduledFerry,
         schoolAndPublicServiceBus,
         schoolBoat,
         schoolBus,
         schoolCoach,
         shortHaulInternationalFlight,
         shuttleBus,
         shuttleCoach,
         shuttleFerryService,
         shuttleFlight,
         shuttleTram,
         sightseeingBus,
         sightseeingCoach,
         sightseeingFlight,
         sightseeingService,
         sightseeingTram,
         sleeperRailService,
         specialCoach,
         specialNeedsBus,
         specialTrain,
         streetCableCar,
         suburbanRailway,
         telecabin,
         telecabinLink,
         touristCoach,
         touristRailway,
         trainFerry,
         trainTram,
         tube,
         undefined,
         undefinedFunicular,
         unknown,
         urbanRailway,
         waterTaxi

    var iconForegroundColor: Color? {
        switch self {
        case .regionalBus, .nightBus, .airportLinkBus, .metro:
            return .white
        default:
            return nil
        }
    }

    var iconBackgroundColor: Color? {
        switch self {
        case .regionalBus, .nightBus, .airportLinkBus:
            return Color("Transport/Region")
        default:
            return nil
        }
    }
}

// MARK: Structs

struct DepartureResponse: Codable {
    let data: [StopPlaceGroup]
}

struct StopPlaceGroup: Codable {
    let stopPlace: StopPlaceInfo
    let quays: [QuayGroup]
}

struct StopPlaceInfo: Codable {
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
    let id: String
    let name: String
    let description: String?
    let publicCode: String?
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
        transportMode = try container.decodeIfPresent(TransportMode.self, forKey: .transportMode)
        transportSubmode = try container.decodeIfPresent(TransportSubMode.self, forKey: .transportSubmode)
        quayId = try container.decode(String.self, forKey: .quayId)
    }
}

struct DepartureTime: Codable {
    let time: Date
    let aimedTime: Date
    let predictionInaccurate: Bool
    let realtime: Bool
    let situations: [SituationElement]
    let serviceJourneyId: String
    let serviceDate: String
}

struct SituationElement: Codable {
    let id: String
    let situationNumber: String
    let summary: [MultilingualString]
    let description: [MultilingualString]
    let reportType: String
}

struct MultilingualString: Codable {
    let language: String?
    let value: String
}

struct DepartureFavouritesRequestBody: Codable {
    let favorites: [FavouriteDeparture]
}

struct QuayRequestBody: Codable {
    let ids: [String]
}

struct QuaysCoordinatesResponse: Codable {
    let quays: [QuayWithLocation]
}

enum EntryState {
    case noFavouriteDepartures, noDepartureQuays, complete, preview
}

struct DepartureWidgetEntry: TimelineEntry {
    let date: Date
    let favouriteDeparture: FavouriteDeparture?
    let stopPlaceGroup: StopPlaceGroup?
    let departures: [DepartureTime]?
    let state: EntryState
}

struct QuayWithLocation: Codable {
    let id: String
    let longitude: Double
    let latitude: Double

    var location: CLLocation {
        CLLocation(latitude: latitude, longitude: longitude)
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        longitude = try container.decode(Double.self, forKey: .longitude)
        latitude = try container.decode(Double.self, forKey: .latitude)
    }
}

struct DepartureLinkLabel: Hashable {
    let label: String
    let link: String
}

struct FavouriteDeparture: Codable {
    let id: String
    let lineId: String
    let lineName: String?
    let lineLineNumber: String
    let lineTransportationMode: TransportMode?
    let lineTransportationSubMode: TransportSubMode?
    let quayName: String
    let quayPublicCode: String?
    let quayId: String

    init(id: String, lineId: String, lineName: String?, lineLineNumber: String, lineTransportationMode: TransportMode?, lineTransportationSubMode: TransportSubMode?, quayName: String, quayPublicCode: String, quayId: String) {
        self.id = id
        self.lineId = lineId
        self.lineName = lineName
        self.lineLineNumber = lineLineNumber
        self.lineTransportationMode = lineTransportationMode
        self.lineTransportationSubMode = lineTransportationSubMode
        self.quayName = quayName
        self.quayPublicCode = quayPublicCode
        self.quayId = quayId
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        lineId = try container.decode(String.self, forKey: .lineId)
        lineName = try container.decodeIfPresent(String.self, forKey: .lineName)
        lineLineNumber = try container.decode(String.self, forKey: .lineLineNumber)
        lineTransportationMode = try container.decodeIfPresent(TransportMode.self, forKey: .lineTransportationMode)
        lineTransportationSubMode = try container.decodeIfPresent(TransportSubMode.self, forKey: .lineTransportationSubMode)
        quayName = try container.decode(String.self, forKey: .quayName)
        quayPublicCode = try container.decodeIfPresent(String.self, forKey: .quayPublicCode)
        quayId = try container.decode(String.self, forKey: .quayId)
    }
}

// MARK: Extensions

extension FavouriteDeparture {
    static let dummy: FavouriteDeparture = .init(
        id: "",
        lineId: "ATB:Line:2_2",
        lineName: "Ranheim",
        lineLineNumber: "1",
        lineTransportationMode: TransportMode.bus,
        lineTransportationSubMode: TransportSubMode.undefined,
        quayName: "Prinsens gate",
        quayPublicCode: "P1",
        quayId: "NSR:Quay:71184"
    )
}

extension StopPlaceGroup {
    static let dummy = StopPlaceGroup(
        stopPlace: StopPlaceInfo(
            id: "",
            description: "",
            name: "Solsiden",
            latitude: 1.0,
            longitude: 1.0
        ),
        quays: [QuayGroup.dummy]
    )
}

extension QuayGroup {
    static let dummy = QuayGroup(
        quay: QuayInfo(
            id: "NSR:Quay:71184",
            name: "Prinsens gate",
            description: nil,
            publicCode: "",
            latitude: 63.43457,
            longitude: 10.39844
        ),
        group: [DepartureGroup.dummy]
    )
}

extension DepartureGroup {
  static let dummy = DepartureGroup(
    lineInfo:
    DepartureLineInfo(
        lineId: "",
        lineName: "Ranheim",
        lineNumber: "1",
        transportMode: TransportMode.bus,
        transportSubmode: TransportSubMode.undefined,
        quayId: "NSR:Quay:71184"
    ),
    departures: [Int](0 ..< 10).map { index in
        let timeInterval = CGFloat(index) * 300
        let timeDate = Date.now.addingTimeInterval(timeInterval)
        return DepartureTime(
            time: timeDate,
            aimedTime: timeDate,
            predictionInaccurate: false,
            realtime: false,
            situations: [],
            serviceJourneyId: "",
            serviceDate: ""
        )
    }
  )
}
