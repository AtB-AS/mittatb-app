import Foundation

struct DepartureData: Codable {
    let data : [StopPlaceGroup]
}
struct StopPlaceGroup: Codable{
    let stopPlace : StopPlaceInfo
    let quays : [QuayGroup]
}

struct StopPlaceInfo: Codable{
    var __typename: String
    let id: String
    let description : String?
    let name : String
    let latitude: Double
    let longitude: Double
}

struct QuayGroup : Codable{
    let quay : QuayInfo
    let group : [DepartureGroup]
}

struct QuayInfo: Codable{
    let __typename: String
    let id: String
    let name : String
    let description : String?
    let latitude: Double
    let longitude: Double
    let situations : [String]
}

struct DepartureGroup : Codable{
    let lineInfo : DepartureLineInfo?
    let departures : [DepartureTime]
}
struct DepartureLineInfo: Codable{
    let lineName : String
    let lineNumber: String
    let transportMode: String
    let transportSubmode: String
    let quayId : String
    let lineId : String
}

struct DepartureTime: Codable, Identifiable{
    let time : Date
    let aimedTime: Date
    let predictionInaccurate: Bool
    let realtime: Bool
    let situations : [String]
    let serviceJourneyId : String
    var id: UUID {
        UUID()
    }
}


