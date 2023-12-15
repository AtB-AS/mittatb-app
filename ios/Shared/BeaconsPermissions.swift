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

protocol PermissionRequestable: AnyObject {
  var onComplete: PermissionCallback? { get set }
  var mandatory: Bool { get set }
  init(mandatory: Bool)
  func request(callback onComplete: @escaping PermissionCallback)
  func response(_ status: Bool)
}

extension PermissionRequestable {
  func response(_ status: Bool) {
    onComplete?(status)
    // NOTE: OnComplete must only be fired once!
    onComplete = nil
  }
}

// Bluetooth Permission
class BluetoothPermission: NSObject, PermissionRequestable, CBCentralManagerDelegate {
  internal var mandatory: Bool
  internal var onComplete: PermissionCallback?
  private var bluetoothManager: CBCentralManager?

  override init() {
    self.mandatory = true
    super.init()
  }

  required init(mandatory: Bool) {
    self.mandatory = mandatory
  }

  deinit {
    bluetoothManager?.delegate = nil
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    guard central.state == .poweredOn else {
      response(mandatory ? false : true)
      return
    }

    response(true)
  }

  func request(callback onComplete: @escaping PermissionCallback) {
    self.onComplete = onComplete
    bluetoothManager = CBCentralManager(delegate: self, queue: nil)
  }
}

// When In Use Permission
class WhenInUsePermission: NSObject, PermissionRequestable, CLLocationManagerDelegate {
  internal var mandatory: Bool
  internal var onComplete: PermissionCallback?

  private var locationManager: CLLocationManager?

  override init() {
    self.mandatory = true
    super.init()
  }

  required init(mandatory: Bool) {
    self.mandatory = mandatory
  }

  deinit {
    locationManager?.delegate = nil
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    guard status == .authorizedWhenInUse else {
      response(mandatory ? false : true)
      return
    }

    response(true)
  }

  func request(callback onComplete: @escaping PermissionCallback) {
    self.onComplete = onComplete
    switch CLLocationManager.authorizationStatus() {
    case .authorizedWhenInUse, .authorizedAlways:
      response(true)
    case .notDetermined:
      UserDefaults.standard.setBool(false, for: .alwaysLocationAuthorizationKey)
      locationManager = CLLocationManager()
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) { [weak self] in
        self?.locationManager?.delegate = self
        self?.locationManager?.requestWhenInUseAuthorization()
      }
    default:
      response(mandatory ? false : true)
    }
  }
}

// Motion Permission
class MotionPermission: NSObject, PermissionRequestable {
  internal var mandatory: Bool
  internal var onComplete: PermissionCallback?
  private var motionManager: CMMotionActivityManager?

  override init() {
    self.mandatory = true
    super.init()
  }

  required init(mandatory: Bool) {
    self.mandatory = mandatory
  }

  func request(callback onComplete: @escaping PermissionCallback) {
    self.onComplete = onComplete
    if CMMotionActivityManager.isActivityAvailable() {
      motionManager = CMMotionActivityManager()
      motionManager?.queryActivityStarting(from: Date(), to: Date(), to: .main, withHandler: { [weak self] _, _  in
        self?.motionManager?.stopActivityUpdates()
        guard let mandatory = self?.mandatory, mandatory else {
          self?.response(true)
          return
        }

        self?.response(CMMotionActivityManager.authorizationStatus() == .authorized)
      })
    } else {
      response(mandatory ? false : true)
    }
  }
}

@objc(BeaconsPermissions)
class BeaconsPermissions: NSObject {
  var bluetoothPermission: BluetoothPermission?
  var whenInUsePermission: WhenInUsePermission?
  var motionPermission: MotionPermission?

  @objc func request(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    bluetoothPermission = BluetoothPermission()
    whenInUsePermission = WhenInUsePermission()
    motionPermission = MotionPermission()

    bluetoothPermission?.request { [weak self] bluetoothPermissionGranted in
      if bluetoothPermissionGranted {
        self?.whenInUsePermission?.request { [weak self] whenInUsePermissionGranted in
          if whenInUsePermissionGranted {
            self?.motionPermission?.request { [weak self] _ in
              resolve(true)
              self?.releasePermissionObjects()
            }
          } else {
            resolve(true)
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
    motionPermission = nil
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
