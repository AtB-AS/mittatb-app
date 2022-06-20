import Foundation
import SystemConfiguration

enum NetworkDeviceStatusEnricher: DeviceStatusEnricher {
    static var status: No_Entur_Abt_Core_V1_DeviceStatus {
        var address = sockaddr_in()
        address.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
        address.sin_family = sa_family_t(AF_INET)

        guard let reachability = withUnsafePointer(to: &address, { pointer in
            pointer.withMemoryRebound(to: sockaddr.self, capacity: MemoryLayout<sockaddr>.size) {
                SCNetworkReachabilityCreateWithAddress(nil, $0)
            }
        }) else {
            return No_Entur_Abt_Core_V1_DeviceStatus.unspecified
        }

        var flags = SCNetworkReachabilityFlags()
        SCNetworkReachabilityGetFlags(reachability, &flags)

        let isReachable = flags.contains(.reachable)
        let needsConnection = flags.contains(.connectionRequired)
        let canConnectAutomatically = flags.contains(.connectionOnDemand) || flags.contains(.connectionOnTraffic)
        let canConnectWithoutUserInteraction = canConnectAutomatically && !flags.contains(.interventionRequired)

        if isReachable && (!needsConnection || canConnectWithoutUserInteraction) {
            return No_Entur_Abt_Core_V1_DeviceStatus.networkConnected
        }

        if !isReachable || needsConnection {
            return No_Entur_Abt_Core_V1_DeviceStatus.networkDisconnected
        }

        return No_Entur_Abt_Core_V1_DeviceStatus.networkNoPermission
    }
}
