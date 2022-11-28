import CoreLocation
import Foundation

@objc class LocationChangeManager: NSObject, CLLocationManagerDelegate {
    // MARK: Private vars

    private var locationManager: CLLocationManager

    // MARK: Public vars

    @objc var onLocationDidChange: ((CLLocation?) -> Void)?

    @objc override init() {
        locationManager = CLLocationManager()

        super.init()

        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
    }

    deinit {
        locationManager.delegate = nil
    }

    @objc func requestLocation() {
        // TODO: If location is not enabled, response nil location
        locationManager.requestLocation()
    }

    @objc func startMonitoringLocationChanges() {
        locationManager.startMonitoringSignificantLocationChanges()
    }

    func locationManager(_: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        debugPrint(#function, status)
    }

    func locationManager(_: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        debugPrint(#function, locations)
        onLocationDidChange?(locations.last)
    }

    func locationManager(_: CLLocationManager, didFailWithError error: Swift.Error) {
        debugPrint(#function, error)
    }
}
