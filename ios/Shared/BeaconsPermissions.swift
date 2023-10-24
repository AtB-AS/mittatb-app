import Foundation
import CoreLocation
import CoreBluetooth
import CoreMotion
import React

@objc(BeaconsPermissions)
class BeaconsPermissions: NSObject, CLLocationManagerDelegate, CBCentralManagerDelegate {
  private let locationManager = CLLocationManager()
  private var bluetoothManager: CBCentralManager?
  private let motionManager = CMMotionActivityManager()

  private var resolve: RCTPromiseResolveBlock?

  private func requestBluetoothPermission() {
    bluetoothManager?.delegate = nil
    bluetoothManager = CBCentralManager(delegate: self, queue: nil)
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    guard central.state == .poweredOn else {
      resolve?(false)
      return
    }

    requestWhileInUseLocation()
  }

  @objc func requestWhileInUseLocation() {
    locationManager.delegate = self
    locationManager.requestWhenInUseAuthorization()
  }

  @objc func requestAlwaysLocation() {
    locationManager.delegate = self
    locationManager.requestAlwaysAuthorization()
  }

  private func requestMotionPermission(completion: @escaping (Bool) -> Void) {
      if CMMotionActivityManager.isActivityAvailable() {
        motionManager.queryActivityStarting(from: Date(), to: Date(), to: .main, withHandler: { _,_  in
          completion(CMMotionActivityManager.authorizationStatus() == .authorized)
          self.motionManager.stopActivityUpdates()
        })
      } else {
        completion(false)
      }
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    if status == .authorizedWhenInUse {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
        self.requestAlwaysLocation()
      }
    } else if status == .authorizedAlways {
      requestMotionPermission { [self] granted in
        resolve?(granted)
      }
    } else {
      resolve?(false)
    }
  }

  @objc func request(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    self.resolve = resolve
    requestBluetoothPermission()
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
