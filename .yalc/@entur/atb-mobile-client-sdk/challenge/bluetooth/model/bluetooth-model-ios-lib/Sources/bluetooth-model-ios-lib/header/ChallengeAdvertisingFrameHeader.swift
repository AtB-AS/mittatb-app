
import Foundation

public final class ChallengeAdvertisingFrameHeader : ChallengeAdvertisingFrameGroupHeader {
    
    static func comparator(a: ChallengeAdvertisingFrameHeader, b: ChallengeAdvertisingFrameHeader) -> Bool {
        if(a.channel != b.channel) {
            return a.channel < b.channel
        }
        
        if(a.clientId != b.clientId) {
            return a.clientId < b.clientId
        }
        
        if(a.correlationId != b.correlationId) {
            return a.correlationId < b.correlationId
        }

        return a.frameNumber < b.frameNumber;
    }
    
    let frameNumber : UInt32
    let lastFrame : Bool
    
    public override var description: String {
        return "clientId: \(clientId) correlationId: \(correlationId) channel: \(channel) frameNumber: \(frameNumber) lastFrame: \(lastFrame)"
    }
    
    init(clientId: UInt32, frameNumber : UInt32, lastFrame : Bool, correlationId: UInt32, channel : UInt32) {
        self.frameNumber = frameNumber;
        self.lastFrame = lastFrame;
        super.init(clientId: clientId, correlationId: correlationId, channel: channel)
    }
    
    public override func hash(into hasher: inout Hasher) {
        hasher.combine(clientId)
        hasher.combine(correlationId)
        hasher.combine(channel)
        hasher.combine(frameNumber)
        hasher.combine(lastFrame)
    }

    public static func == (a:ChallengeAdvertisingFrameHeader, b:ChallengeAdvertisingFrameHeader) -> Bool {
        return
            a.clientId == b.clientId &&
            a.correlationId == b.correlationId &&
            a.channel == b.channel &&
            a.frameNumber == b.frameNumber &&
            a.lastFrame == b.lastFrame
    }
    
    static func < (lhs: ChallengeAdvertisingFrameHeader, rhs: ChallengeAdvertisingFrameHeader) -> Bool {
        return ChallengeAdvertisingFrameHeader.comparator(a: lhs, b: rhs)
    }
    
}
