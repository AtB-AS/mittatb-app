#if canImport(CoreNFC)
    import CoreNFC
#endif

import Foundation

enum NfcDeviceStatusEnricher: DeviceStatusEnricher {
    static var status: No_Entur_Abt_Core_V1_DeviceStatus {
        #if canImport(CoreNFC)
            if NFCNDEFReaderSession.readingAvailable {
                return No_Entur_Abt_Core_V1_DeviceStatus.nfcEnabled
            }

            return No_Entur_Abt_Core_V1_DeviceStatus.nfcDisabled
        #else
            return No_Entur_Abt_Core_V1_DeviceStatus.nfcUnsupportedOnDevice
        #endif
    }
}
