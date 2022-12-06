import Foundation
#if canImport(WidgetKit)
    import WidgetKit
#endif

@objc class WidgetUpdater: NSObject {
    /// Update widget timelime
    @objc static func requestUpdate() {
        #if canImport(WidgetKit)
            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        #endif
    }
}
