import Foundation

struct Body: Codable {
    let favorites: [DepartureLine]
}

enum AppEndPoint: String {
    case favoriteDepartures, example

    var path: String {
        switch self {
        case .favoriteDepartures:
            var url = URLComponents(string: "https://api.staging.mittatb.no/bff/v2/departure-favorites")!

            url.queryItems = [
                URLQueryItem(name: "limitPerLine", value: "20"),
                URLQueryItem(name: "startTime", value: Date().ISO8601Format()),
                URLQueryItem(name: "pageSize", value: "0"),
            ]

            return url.string!
        case .example:
            return ""
        }
    }

    var url: URL? {
        URL(string: path)
    }

    var method: String {
        "POST"
    }

    var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        var request = URLRequest(url: url)
        request.httpMethod = method

        return request
    }
}

enum APIError: Error {
    case errorFromServer, decodeError
}

class APIService {
    func fetchData<T: Codable>(endPoint: AppEndPoint, data: Data, callback: @escaping (Result<T, Error>) -> Void) {
        guard var request = endPoint.request else {
            return
        }

        request.setValue("application/JSON", forHTTPHeaderField: "Content-Type")
        request.httpBody = data

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                callback(.failure(error))
                print(error)
                return
            }
            guard let response = response as? HTTPURLResponse,
                  (200 ... 299).contains(response.statusCode) else {
                callback(.failure(APIError.errorFromServer))

                return
            }

            guard let result = try? decoder.decode(T.self, from: data!) else {
                callback(.failure(APIError.decodeError))
                return
            }

            callback(.success(result))
        }
        task.resume()
    }

    func fetchFavoriteDepartures(favorite: DepartureLine, callback: @escaping (Result<DepartureGroup, Error>) -> Void) {
        let body = Body(favorites: [favorite])

        guard let uploadData = try? JSONEncoder().encode(body) else {
            return
        }

        fetchData(endPoint: .favoriteDepartures, data: uploadData) { (result: Result<DepartureData, Error>) in

            switch result {
            case let .success(object):
                print(object)
                callback(.success(object.data[0].quays[0].group[0]))
            case let .failure(error):
                print(error)
                callback(.failure(error))
            }
        }
    }
}
