import Foundation

enum AppEndPoint: String {
    case favoriteDepartures, quayLocations

    var path: String? {
        switch self {
        case .favoriteDepartures:
            var url = URLComponents(string: "https://api.staging.mittatb.no/bff/v2/departure-favorites")
            url?.queryItems = [
                /* Fetching a large number of departures to be able to give the widgetManager a better
                 estimate of the future rerenders needed */
                URLQueryItem(name: "limitPerLine", value: "50"),
                URLQueryItem(name: "startTime", value: Date().ISO8601Format()),
                URLQueryItem(name: "pageSize", value: "0"),
            ]

            return url?.string
        case .quayLocations:
            let url = URLComponents(string: "http://10.100.0.105:8080/bff/v2/quay-locations")
            return url?.string
        }
    }

    var url: URL? {
        guard let path = path else {
            return nil
        }

        return URL(string: path)
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
    case errorFromServer, decodeError, noDataError
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

    /// Fetch departure times for a given departure
    func fetchDepartureTimes(departure: FavoriteDeparture, callback: @escaping (Result<QuayGroup, Error>) -> Void) {
        let body = DepartureRequestBody(favorites: [departure])

        guard let uploadData = try? JSONEncoder().encode(body) else {
            return
        }

        fetchData(endPoint: .favoriteDepartures, data: uploadData) { (result: Result<DepartureData, Error>) in
            switch result {
            case let .success(object):
                debugPrint(object)

                // Api may return empty quays, therefore needs to find the correct one
                guard let quayGroup = object.data.first!.quays.first(where: { $0.quay.id.elementsEqual(departure.quayId) }) else {
                    debugPrint(APIError.noDataError)
                    callback(.failure(APIError.noDataError))

                    return
                }

                callback(.success(quayGroup))
            case let .failure(error):
                debugPrint(error)
                callback(.failure(error))
            }
        }
    }

    /// Fetch locations of departures
    func fetchLocations(quays: [FavoriteDeparture], callback: @escaping (Result<[QuayWithLocation], Error>) -> Void) {
        
        let body = QuayRequestBody(ids: quays.map { $0.quayId})
      
        guard let uploadData = try? JSONEncoder().encode(body) else {
            return
        }
        print(uploadData)
        fetchData(endPoint: .quayLocations, data: uploadData) { (result: Result<[QuayWithLocation], Error>) in
            switch result {
            case let .success(object):
                callback(.success(object))
            case let .failure(error):
                debugPrint(error)
                callback(.failure(error))
            }
        }
    }
}
