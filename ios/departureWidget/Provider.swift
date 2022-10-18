import WidgetKit
import SwiftUI
import CoreLocation
import Foundation

struct Provider: TimelineProvider {
  
  let locationManager = LocationManager()
  let apiService = APIService()


    func placeholder(in context: Context) -> Entry {
      Entry(date: Date(), quayGroup: nil)
  }

  func getSnapshot(in context: Context, completion: @escaping (Entry) -> ()) {
    let entry = Entry(date: Date(), quayGroup: nil)
        completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    
    let favoriteDepartures = getStoredFavorites()
    
    let closestDeparture = getClosestDeparture(departureData: favoriteDepartures)
      
    let date = Calendar.current.date(byAdding: .minute, value: 5, to: Date())!

    apiService.fetchFavoriteDepartures(favorite: closestDeparture) { (result: Result<DepartureGroup, Error>)  in
    
        switch result{
        case .success(let object):
          // TODO: Object `Entry` is expecting a `quayGroup` not `departureGroup`
          let timeline = Timeline(entries: [Entry(date: date, quayGroup: nil)], policy: .atEnd)
          completion(timeline)
        case .failure(_):
            return
        }
    }
  }
  
  func getStoredFavorites() -> [Favorite]{
    let defaults = UserDefaults(suiteName: "group.no.mittatb")!
    let jsonString = defaults.string(forKey: "ATB_user_departures")
    let jsonData = jsonString?.data(using: .utf8)
    
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601
  
    return try! decoder.decode([Favorite].self, from: jsonData!)
  }
  
  
  func getClosestDeparture(departureData: [Favorite]) -> Favorite {

    var closestDeparture: Favorite = departureData[0]
    var smallestDistance: CLLocationDistance?

    for departure in departureData {
      let distance = departure.getLocation().distance(from: locationManager.lastLocation ?? CLLocation(latitude: 63.43457, longitude: 10.39844))
      if smallestDistance == nil || distance < smallestDistance! {
        closestDeparture = departure
        smallestDistance = distance
      }
    }

    return closestDeparture
  }
}
