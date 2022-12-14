import Foundation

private enum K {
    static let RCTStorageDirectory = "RCTAsyncLocalStorage_V1"
    static let RCTManifestFileName = "manifest.json"
    static let applicationGroupIdentifier = "group.no.mittatb"
}

enum ManifestError: Error {
    case invalidType, keyValueNotFound, decodingData
}

struct Manifest: Codable {
    enum CodingKeys: String, CodingKey {
        case favouriteDepartures = "@ATB_user_departures"
    }

    let favouriteDepartures: [FavouriteDeparture]?

    static var data: Manifest? {
        buildManifest()
    }

    private static var storageDirectoryURL: URL? {
        guard let bundleIdentifier = Bundle.app.bundleIdentifier else {
            return nil
        }

        let directory = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: K.applicationGroupIdentifier)
        return directory?.appendingPathComponent(bundleIdentifier).appendingPathComponent(K.RCTStorageDirectory)
    }

    private static var manifestURL: URL? {
        storageDirectoryURL?.appendingPathComponent(K.RCTManifestFileName)
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        var departuresData: Data?
        if let favouriteDeparturesData = try? container.decodeIfPresent(String.self, forKey: .favouriteDepartures)?.data(using: .utf8) {
            departuresData = favouriteDeparturesData
            // Let's try find data from the key-file
        } else if let key = CodingKeys.favouriteDepartures.rawValue.md5(),
                  let keyFilePath = Manifest.storageDirectoryURL?.appendingPathComponent(key).relativePath, FileManager.default.fileExists(atPath: keyFilePath) {
            departuresData = NSData(contentsOfFile: keyFilePath) as? Data
        }

        guard let departuresData = departuresData else {
            throw ManifestError.keyValueNotFound
        }

        do {
            favouriteDepartures = try JSONDecoder().decode([FavouriteDeparture].self, from: departuresData)
        } catch {
            debugPrint("Error decoding data with error: \(error)")
            throw ManifestError.decodingData
        }
    }

    private static func buildManifest() -> Manifest? {
        guard let manifestPath = manifestURL?.relativePath, FileManager.default.fileExists(atPath: manifestPath)
        else {
            return nil
        }

        guard let jsonData = NSData(contentsOfFile: manifestPath) as? Data else {
            return nil
        }

        return try? JSONDecoder().decode(Manifest.self, from: jsonData)
    }
}
