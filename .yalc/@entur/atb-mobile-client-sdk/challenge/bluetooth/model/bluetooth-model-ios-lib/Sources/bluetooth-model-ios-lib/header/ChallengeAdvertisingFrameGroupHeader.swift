
import Foundation

// Header with the fields common to a frame group (from the same Challenge).

public class ChallengeAdvertisingFrameGroupHeader : Hashable, CustomStringConvertible {
 
    // implementation note: this could have been a subclass of the header
    // but we need the header as a map key, so keep it as is
    
    let clientId : UInt32
    let correlationId : UInt32
    let channel : UInt32
    
    public var description: String {
        return "clientId: \(clientId) correlationId: \(correlationId) channel: \(channel)"
    }

    convenience init(h : ChallengeAdvertisingFrameHeader) {
        self.init(clientId: h.clientId, correlationId: h.correlationId, channel: h.channel)
    }

    init(clientId: UInt32, correlationId: UInt32, channel : UInt32) {
        self.clientId = clientId;
        self.correlationId = correlationId;
        self.channel = channel;
    }
    
    public func hash(into hasher: inout Hasher) {
        hasher.combine(clientId)
        hasher.combine(correlationId)
        hasher.combine(channel)
    }

    public static func == (a:ChallengeAdvertisingFrameGroupHeader, b:ChallengeAdvertisingFrameGroupHeader) -> Bool {
        return a.clientId == b.clientId && a.correlationId == b.correlationId && a.channel == b.channel
    }
    
}
