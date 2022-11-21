import CoreLocation
import WidgetKit

class LocationManager: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    private var locationStatus: CLAuthorizationStatus?


    override init() {
        super.init()
      
        debugPrint("Location manager initialized")
        locationManager.delegate = self
        locationManager.startUpdatingLocation()
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.startMonitoringSignificantLocationChanges()
    }
  
  func locationManager(_: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
      debugPrint("update in status")

      locationStatus = status
  }

    func locationManager(_: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
      debugPrint("update in location")
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      } else {
        // Fallback on earlier versions
      }
     
    }

    func locationManager(_: CLLocationManager, didFailWithError _: Swift.Error) {}
}
