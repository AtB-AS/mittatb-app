import Foundation
import SystemConfiguration

enum DeviceStatusProvider {
    case bluetooth
    case network
    case nfc

    var status: No_Entur_Abt_Core_V1_DeviceStatus {
        switch self {
        case .bluetooth:
            return BluetoothDeviceStatusEnricher.status
        case .network:
            return NetworkDeviceStatusEnricher.status
        case .nfc:
            return NfcDeviceStatusEnricher.status
        }
    }
}
