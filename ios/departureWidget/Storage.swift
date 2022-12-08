import Foundation

private enum K {
    static let RCTStorageDirectory = "RCTAsyncLocalStorage_V1"
    static let RCTManifestFileName = "manifest.json"
    static let applicationGroupIdentifier = "group.no.mittatb"
}

enum ManifestError: Error {
    case invalidType, parsingData, decodingData
}

struct Manifest: Codable {
    enum CodingKeys: String, CodingKey {
        case favouriteDepartures = "@ATB_user_departures"
    }

    let favouriteDepartures: [FavouriteDeparture]?

    static var data: Manifest? {
        buildManifest()
    }

    init(from decoder: Decoder) throws {
        let container = try? decoder.container(keyedBy: CodingKeys.self)
        guard let departuresJsonString = try? container?.decodeIfPresent(String.self, forKey: .favouriteDepartures) else {
            throw ManifestError.invalidType
        }

        guard let departuresJsonData = departuresJsonString?.data(using: .utf8) else {
            throw ManifestError.parsingData
        }

        do {
            favouriteDepartures = try JSONDecoder().decode([FavouriteDeparture].self, from: departuresJsonData)
        } catch {
            debugPrint("Error decoding data with error: \(error)")
            throw ManifestError.decodingData
        }
    }

    private static func buildManifest() -> Manifest? {
        guard let bundleIdentifier = Bundle.app.bundleIdentifier else {
            return nil
        }

        let pathUrl = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: K.applicationGroupIdentifier)
        guard let path = pathUrl?.appending(components: bundleIdentifier).appending(path: K.RCTStorageDirectory).appending(path: K.RCTManifestFileName).relativePath, FileManager.default.fileExists(atPath: path)
        else {
            return nil
        }

        guard let jsonData = NSData(contentsOfFile: path) else {
            return nil
        }

        return try? JSONDecoder().decode(Manifest.self, from: Data(jsonData))
    }
}
