import CoreBluetooth
import Foundation

enum BluetoothDeviceStatusEnricher: DeviceStatusEnricher {
    static var status: No_Entur_Abt_Core_V1_DeviceStatus {
        let manager = CBCentralManager(delegate: nil, queue: nil, options: [CBCentralManagerOptionShowPowerAlertKey: false])

        switch manager.state {
        case .unsupported:
            return No_Entur_Abt_Core_V1_DeviceStatus.bluetoothUnsupportedOnDevice
        case .poweredOff:
            return No_Entur_Abt_Core_V1_DeviceStatus.bluetoothDisabled
        case .poweredOn:
            return No_Entur_Abt_Core_V1_DeviceStatus.bluetoothEnabled
        default:
            return No_Entur_Abt_Core_V1_DeviceStatus.bluetoothNoPermission
        }
    }
}
