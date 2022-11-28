import CoreLocation
import Foundation

@objc class LocationChangeManager: NSObject, CLLocationManagerDelegate {
    /// Single instance `shared` var
    @objc static let shared = LocationChangeManager()

    private let locationManager = CLLocationManager()

    // MARK: Public vars

    @objc var onLocationDidChange: ((CLLocation) -> Void)?
    private(set) var lastKnownLocation: CLLocation?

    override private init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        locationManager.requestLocation()
        locationManager.startMonitoringSignificantLocationChanges()
    }

    deinit {
        locationManager.delegate = nil
    }

    func locationManager(_: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        debugPrint(#function, status)
    }

    func locationManager(_: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        debugPrint(#function, locations)
        guard let location = locations.last else { return }

        lastKnownLocation = location
        onLocationDidChange?(location)
    }

    func locationManager(_: CLLocationManager, didFailWithError error: Swift.Error) {
        debugPrint(#function, error)
    }
}
