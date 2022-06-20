import Foundation

protocol DeviceDetailsProvider {
    var deviceDetails: No_Entur_Abt_Core_V1_DeviceDetails { get }

    var deviceInfo: [Uk_Org_Netex_Www_Netex_DeviceInfoElement] { get }

    var deviceStatuses: [No_Entur_Abt_Core_V1_DeviceStatus] { get }
}
