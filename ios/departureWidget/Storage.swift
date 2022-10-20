import Foundation

private enum K {
    static let RCTStorageDirectory = "RCTAsyncLocalStorage_V1"
    static let RCTManifestFileName = "manifest.json"
    static let applicationGroupIdentifier = "group.no.mittatb"
}

enum ManifestError: Error {
    case invalidType, parsingData
}

struct Manifest: Codable {
    enum CodingKeys: String, CodingKey {
        case departures = "@ATB_user_departures"
    }

    let departures: [DepartureLine]?

    // NOTE: Consider using a non-static value, it might be that is no need to cache this!
    static var data = buildManifest()

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        guard let departuresJsonString = try container.decodeIfPresent(String.self, forKey: .departures) else {
            throw ManifestError.invalidType
        }

        guard let departuresJsonData = departuresJsonString.data(using: .utf8) else {
            throw ManifestError.parsingData
        }

        departures = try JSONDecoder().decode([DepartureLine].self, from: departuresJsonData)
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
