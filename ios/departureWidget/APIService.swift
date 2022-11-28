import Foundation

enum AppEndPoint: String {
    case favoriteDepartures, quayCoordinates

    private var host: String {
        "https://api.staging.mittatb.no"
    }

    private var path: String? {
        switch self {
        case .favoriteDepartures:
            var urlComponents = URLComponents(string: "\(host)/bff/v2/departure-favorites")
            urlComponents?.queryItems = [
                /* Fetching a large number of departures to be able to give the widgetManager a better
                 estimate of the future rerenders needed */
                URLQueryItem(name: "limitPerLine", value: "50"),
                URLQueryItem(name: "startTime", value: Date().ISO8601Format()),
                URLQueryItem(name: "pageSize", value: "0"),
            ]

            return urlComponents?.string
        case .quayCoordinates:
            return "\(host)/bff/v2/quays-coordinates"
        }
    }

    private var url: URL? {
        guard let path = path else {
            return nil
        }

        return URL(string: path)
    }

    private var method: String {
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
    case errorFromServer, decodeError, noDataError, encodingError
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
                debugPrint(error)
                return
            }

            guard let response = response as? HTTPURLResponse,
                  (200 ... 299).contains(response.statusCode),
                  let data = data else {
                callback(.failure(APIError.errorFromServer))

                return
            }

            #if DEBUG
                let stringData = String(decoding: data, as: UTF8.self)
                debugPrint(stringData)
            #endif

            do {
                let result = try decoder.decode(T.self, from: data)
                callback(.success(result))
            } catch {
                callback(.failure(error))
                callback(.failure(APIError.decodeError))
            }
        }

        task.resume()
    }

    /// Fetch departure times for a given departure
    func fetchDepartureTimes(departure: FavoriteDeparture, callback: @escaping (Result<QuayGroup, Error>) -> Void) {
        let body = DepartureRequestBody(favorites: [departure])

        guard let departureRequestData = try? JSONEncoder().encode(body) else {
            return callback(.failure(APIError.encodingError))
        }

        fetchData(endPoint: .favoriteDepartures, data: departureRequestData) { (result: Result<DepartureResponse, Error>) in
            switch result {
            case let .success(object):
                debugPrint(object)

                // Api may return empty quays, therefore needs to find the correct one
                guard let quayGroup = object.data.first?.quays.first(where: { $0.quay.id == departure.quayId }) else {
                    debugPrint(APIError.noDataError)
                    callback(.failure(APIError.noDataError))

                    return
                }

                return callback(.success(quayGroup))
            case let .failure(error):
                debugPrint(error)
                return callback(.failure(error))
            }
        }
    }

    /// Fetch locations of departures
    func fetchLocations(quays: [FavoriteDeparture], callback: @escaping (Result<QuaysCoordinatesResponse, Error>) -> Void) {
        let body = QuayRequestBody(ids: quays.map(\.quayId))

        guard let uploadData = try? JSONEncoder().encode(body) else {
            return
        }

        fetchData(endPoint: .quayCoordinates, data: uploadData) { (result: Result<QuaysCoordinatesResponse, Error>) in
            switch result {
            case let .success(object):
                callback(.success(object))
            case let .failure(error):
                callback(.failure(error))
            }
        }
    }
}
