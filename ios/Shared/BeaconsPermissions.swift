import Foundation
import CoreLocation
import CoreBluetooth
import CoreMotion
import React

enum UserDefaultsKey: String {
  case alwaysLocationAuthorizationKey
}

extension UserDefaults {
  func setBool(_ value: Bool, for key: UserDefaultsKey) {
    set(value, forKey: key.rawValue)
  }

  func getBool(for key: UserDefaultsKey) -> Bool {
    return bool(forKey: key.rawValue)
  }
}

typealias PermissionCallback = (Bool) -> Void

// Bluetooth Permission
class BluetoothPermission: NSObject, CBCentralManagerDelegate {
  private var bluetoothManager: CBCentralManager?
  private var onComplete: PermissionCallback?

  override init() {
    super.init()
  }

  deinit {
    bluetoothManager?.delegate = nil
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    guard central.state == .poweredOn else {
      onComplete?(false)
      return
    }

    onComplete?(true)
  }

  func requestPermission(callback onComplete: @escaping PermissionCallback) {
    self.onComplete = onComplete
    bluetoothManager = CBCentralManager(delegate: self, queue: nil)
  }
}

// When In Use Permission
class WhenInUsePermission: NSObject, CLLocationManagerDelegate {
  private var locationManager: CLLocationManager?
  var onComplete: PermissionCallback?

  override init() {
    super.init()
  }

  deinit {
    locationManager?.delegate = nil
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    guard status == .authorizedWhenInUse else {
      onComplete?(false)
      return
    }

    onComplete?(true)
  }

  func requestPermission(callback onComplete: @escaping PermissionCallback) {
    self.onComplete = onComplete
    switch CLLocationManager.authorizationStatus() {
    case .authorizedWhenInUse, .authorizedAlways:
      onComplete(true)
    case .notDetermined:
      UserDefaults.standard.setBool(false, for: .alwaysLocationAuthorizationKey)
      locationManager = CLLocationManager()
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
        self?.locationManager?.delegate = self
        self?.locationManager?.requestWhenInUseAuthorization()
      }
    default:
      onComplete(false)
    }
  }
}

// When In Use Permission
class AlwaysUsePermission: NSObject, CLLocationManagerDelegate {
  private var locationManager: CLLocationManager?
  var onComplete: PermissionCallback?

  override init() {
    super.init()
  }

  deinit {
    locationManager?.delegate = nil
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    guard status == .authorizedAlways else {
      onComplete?(false)
      return
    }

    onComplete?(true)
  }

  func requestPermission(callback onComplete: @escaping PermissionCallback) {
    self.onComplete = onComplete
    switch CLLocationManager.authorizationStatus() {
    case .authorizedAlways:
      onComplete(true)
    case .authorizedWhenInUse:
      guard !UserDefaults.standard.getBool(for: .alwaysLocationAuthorizationKey) else {
        onComplete(false)
        return
      }

      locationManager = CLLocationManager()
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
        UserDefaults.standard.setBool(true, for: .alwaysLocationAuthorizationKey)
        self?.locationManager?.delegate = self
        self?.locationManager?.requestAlwaysAuthorization()
      }
    default:
      onComplete(false)
    }
  }
}

// Motion Permission
class MotionPermission: NSObject {
  private var motionManager: CMMotionActivityManager?

  override init() {
    super.init()
  }

  func requestPermission(callback onComplete: @escaping PermissionCallback) {
    if CMMotionActivityManager.isActivityAvailable() {
      motionManager = CMMotionActivityManager()
      motionManager?.queryActivityStarting(from: Date(), to: Date(), to: .main, withHandler: { [weak self] _, _  in
        onComplete(CMMotionActivityManager.authorizationStatus() == .authorized)
        self?.motionManager?.stopActivityUpdates()
      })
    } else {
      onComplete(false)
    }
  }
}

@objc(BeaconsPermissions)
class BeaconsPermissions: NSObject {
  var bluetoothPermission: BluetoothPermission?
  var whenInUsePermission: WhenInUsePermission?
  var alwaysPermission: AlwaysUsePermission?
  var motionPermission: MotionPermission?

  @objc func request(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    bluetoothPermission = BluetoothPermission()
    whenInUsePermission = WhenInUsePermission()
    alwaysPermission = AlwaysUsePermission()
    motionPermission = MotionPermission()

    bluetoothPermission?.requestPermission { [weak self] bluetoothPermissionGranted in
      if bluetoothPermissionGranted {
        self?.whenInUsePermission?.requestPermission { [weak self] whenInUsePermissionGranted in
          if whenInUsePermissionGranted {
            self?.alwaysPermission?.requestPermission { [weak self] alwaysPermissionGranted in
              if alwaysPermissionGranted {
                self?.motionPermission?.requestPermission { [weak self] motionPermissionGranted in
                  resolve(motionPermissionGranted)
                  self?.releasePermissionObjects()
                }
              } else {
                resolve(false)
                self?.releasePermissionObjects()
              }
            }
          } else {
            resolve(false)
            self?.releasePermissionObjects()
          }
        }
      } else {
        resolve(false)
        self?.releasePermissionObjects()
      }
    }
  }

  private func releasePermissionObjects() {
    bluetoothPermission = nil
    whenInUsePermission = nil
    alwaysPermission = nil
    motionPermission = nil
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
