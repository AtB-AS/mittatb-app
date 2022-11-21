import CoreLocation
import WidgetKit

class LocationManager: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.startMonitoringSignificantLocationChanges()
        locationManager.requestAlwaysAuthorization()
        locationManager.allowsBackgroundLocationUpdates = true
    }

    func locationManager(_: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
      debugPrint("so i got an update in location")
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      } else {
        // Fallback on earlier versions
      }
     
    }

    func locationManager(_: CLLocationManager, didFailWithError _: Swift.Error) {}
}
