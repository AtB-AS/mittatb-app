import Foundation
import CoreLocation
import CoreBluetooth
import CoreMotion
import React

private struct AuthStore {
  static let hasRequestedAlwaysKey = "hasRequestedAlwaysAuthorization"

  static func setRequestAlwaysPresented() {
    UserDefaults.standard.set(true, forKey: hasRequestedAlwaysKey)
  }

  static func hasRequestedAlways() -> Bool {
    return UserDefaults.standard.bool(forKey: hasRequestedAlwaysKey)
  }
}

@objc(BeaconsPermissions)
class BeaconsPermissions: NSObject, CLLocationManagerDelegate, CBCentralManagerDelegate {
  private enum LocationType {
    case whenInUse, always
  }

  private let locationManager = CLLocationManager()
  private var bluetoothManager: CBCentralManager?
  private let motionManager = CMMotionActivityManager()

  private var resolve: RCTPromiseResolveBlock?
  private var requestedLocationType: LocationType?

  private func requestBluetoothPermission() {
    bluetoothManager = CBCentralManager(delegate: self, queue: nil)
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    guard central.state == .poweredOn else {
      responseStatus(false)
      return
    }

    self.requestWhileInUseLocation()
  }

  @objc func requestWhileInUseLocation() {
    locationManager.delegate = self
    requestedLocationType = .whenInUse
    let currentStatus = CLLocationManager.authorizationStatus()

    // Already authorized
    if currentStatus == .authorizedWhenInUse {
      return requestAlwaysLocation()
    }

    if currentStatus == .notDetermined {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
        self?.locationManager.requestWhenInUseAuthorization()
      }
      return
    }

    responseStatus(false)
  }

  @objc func requestAlwaysLocation() {
    locationManager.delegate = self
    requestedLocationType = .always
    let currentStatus = CLLocationManager.authorizationStatus()

    // Already authorized
    if currentStatus == .authorizedAlways {
      requestMotionPermission { [weak self] granted in
        self?.responseStatus(granted)
      }
      return
    }

    if currentStatus == .authorizedWhenInUse {
      if !AuthStore.hasRequestedAlways() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
          AuthStore.setRequestAlwaysPresented()
          self?.locationManager.requestAlwaysAuthorization()
        }
        return
      }
    }

    responseStatus(false)
  }

  private func requestMotionPermission(completion: @escaping (Bool) -> Void) {
      if CMMotionActivityManager.isActivityAvailable() {
        motionManager.queryActivityStarting(from: Date(), to: Date(), to: .main, withHandler: { _, _  in
          completion(CMMotionActivityManager.authorizationStatus() == .authorized)
          self.motionManager.stopActivityUpdates()
        })
      } else {
        completion(false)
      }
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    if status == .authorizedWhenInUse {
      // If the user was prompted to accept `always` location but kept the option `whenInUse`, then falls here,
      // in that case return false because `always` is a requirement otherwise means that it comes from `whenInUse` so then continue with asking for `always`
      if requestedLocationType == .always {
        responseStatus(false)
        return
      }

      self.requestAlwaysLocation()
      return
    } else if status == .authorizedAlways && requestedLocationType == .always {
      requestMotionPermission { [self] granted in
        responseStatus(granted)
      }
      return
    }

    responseStatus(false)
  }

  @objc func request(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.resolve = resolve
    requestBluetoothPermission()
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  private func responseStatus(_ status: Bool) {
    bluetoothManager?.delegate = nil
    locationManager.delegate = nil
    requestedLocationType = nil
    resolve?(status)
  }
}
