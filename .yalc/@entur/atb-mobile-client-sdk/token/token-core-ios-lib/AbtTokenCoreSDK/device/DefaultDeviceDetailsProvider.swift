import CoreBluetooth
import Foundation
import UIKit

enum AppInfo: String {
    case version = "CFBundleShortVersionString"
    case teamIdentifier = "AppTeamIdentifier"
    case environment = "AppEnvironment"
    case bundleIdentifier

    var value: String {
        switch self {
        case .bundleIdentifier:
            return Bundle.main.bundleIdentifier ?? defaultValue
        default:
            // Finds information inside info.plist file!
            guard let infoValue = Bundle.main.object(forInfoDictionaryKey: rawValue) as? String else {
                return defaultValue
            }

            return infoValue
        }
    }

    var defaultValue: String {
        switch self {
        case .version:
            return "1.0.0"
        case .environment:
            return "DEVELOPMENT"
        default:
            return "unknown"
        }
    }
}

public struct DefaultDeviceDetailsProvider: DeviceDetailsProvider {
    private enum K {
        static let manufacturer = "Apple"
    }

    public init() {}

    var deviceDetails: No_Entur_Abt_Core_V1_DeviceDetails {
        No_Entur_Abt_Core_V1_DeviceDetails.with { details in
            details.deviceStatuses = deviceStatuses
            details.deviceInfo = deviceInfo
        }
    }

    var deviceInfo: [Uk_Org_Netex_Www_Netex_DeviceInfoElement] {
        [
            // Application
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.applicationID
                info.value = AppInfo.bundleIdentifier.value
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.applicationVersion
                info.value = AppInfo.version.value
            },
            // Device
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.iosAppleTeamIdentifier
                // NOTE: Please provide this information on the Info.plist, please notice that it could change between different release versions due to the app could be signed with different certificates.
                info.value = AppInfo.teamIdentifier.value
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.osApiLevel
                info.value = UIDevice.current.systemVersion
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.manufacturer
                info.value = K.manufacturer
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.modelID
                info.value = UIDevice.current.model
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.deviceID
                // NOTE: This value is the same between the same vendor running on the same device only!
                // for more details https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor
                // If want to opt for a more unique but with more restrictions please read:
                // https://developer.apple.com/documentation/adsupport/asidentifiermanager/1614151-advertisingidentifier
                info.value = UIDevice.current.identifierForVendor?.uuidString ?? ""
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.osVersion
                info.value = UIDevice.current.systemVersion
            },
            Uk_Org_Netex_Www_Netex_DeviceInfoElement.with { info in
                info.type = Uk_Org_Netex_Www_Netex_DeviceInfoType.iosAppAttestEnvironment
                // NOTE: Please provide this information on the Info.plist, please notice that it could change between different configurations in the app for instance: `staging`, `development`, `release`, etc.
                info.value = AppInfo.environment.value
            },
        ]
    }

    var deviceStatuses: [No_Entur_Abt_Core_V1_DeviceStatus] {
        [
            No_Entur_Abt_Core_V1_DeviceStatus.attestationOk,
            DeviceStatusProvider.bluetooth.status,
            DeviceStatusProvider.network.status,
            DeviceStatusProvider.nfc.status,
        ]
    }
}
