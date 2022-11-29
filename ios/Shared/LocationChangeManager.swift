import CoreLocation
import Foundation

typealias LocationCallback = (CLLocation?) -> Void

@objc class LocationChangeManager: NSObject, CLLocationManagerDelegate {
    // MARK: Private vars

    private var locationManager: CLLocationManager

    // MARK: Public vars

    private var onRequestLocation: LocationCallback?
    @objc var onLocationDidChange: LocationCallback?

    var isLocationEnabled: Bool {
        if CLLocationManager.locationServicesEnabled() {
            switch CLLocationManager.authorizationStatus() {
            case .notDetermined, .restricted, .denied:
                return false
            case .authorizedAlways, .authorizedWhenInUse:
                return true
            @unknown default:
                return false
            }
        }

        return false
    }

    @objc override init() {
        locationManager = CLLocationManager()

        super.init()

        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters
        locationManager.requestWhenInUseAuthorization()
    }

    deinit {
        locationManager.delegate = nil
    }

    @objc func requestLocation(onCompete callback: @escaping LocationCallback) {
        if isLocationEnabled {
            onRequestLocation = callback
            locationManager.requestLocation()
            return
        }

        callback(nil)
    }

    @objc func startMonitoringLocationChanges() {
        locationManager.startMonitoringSignificantLocationChanges()
        locationManager.requestLocation()
    }

    func locationManager(_: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        debugPrint(#function, status)
    }

    func locationManager(_: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        debugPrint(#function, locations)
        if let onRequestLocation = onRequestLocation {
            onRequestLocation(locations.last)
            self.onRequestLocation = nil
        }

        onLocationDidChange?(locations.last)
    }

    func locationManager(_: CLLocationManager, didFailWithError error: Swift.Error) {
        debugPrint(#function, error)
    }
}
