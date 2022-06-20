
import Foundation

enum FrameHeaderBinaryFormatError: Error {
    case rangeError(String)
}

/**
 * Header format <br>
 * <br>
 * - Channel (3 bit)<br>
 * - Last frame (1 bit)<br>
 * - Frame number (4 bit)<br>
 * - Client id (2 bytes)<br>
 * - Correlation id (1 byte)<br>
 * <br>
 * So in total 4 bytes.
 */

class ChallengeAdvertisingFrameHeaderBinaryFormat {
    
    public static let FRAME_HEADER_LENGTH = 4
    
    static let LAST_FRAME_MASK : UInt8 = 0b00010000
    static let CHANNEL_MASK : UInt8 = 0b00000111
    static let FRAME_NUMBER_MASK : UInt8 = 0b0001111
    
    static let MAX_FRAMES = 16
    static let MAX_CLIENT_ID = 65535
    static let MAX_CORRELATION_ID = 255
    
    public func parse(headerBytes: inout Data) -> ChallengeAdvertisingFrameHeader {
        let b = headerBytes[0]
        
        let channel : UInt32 = UInt32((b >> 5) & ChallengeAdvertisingFrameHeaderBinaryFormat.CHANNEL_MASK)
        
        let lastFrame = (b & ChallengeAdvertisingFrameHeaderBinaryFormat.LAST_FRAME_MASK) != 0
        
        let frameNumber : UInt32 = UInt32(b & ChallengeAdvertisingFrameHeaderBinaryFormat.FRAME_NUMBER_MASK)
        
        let clientId : UInt32 = UInt32(((headerBytes[1] << 8) + headerBytes[2]))
        
        let correlationId : UInt32 = UInt32(headerBytes[3])
        
        return ChallengeAdvertisingFrameHeader(clientId: clientId, frameNumber: frameNumber, lastFrame: lastFrame, correlationId: correlationId, channel: channel)
    }
    
    public func serialize(header: ChallengeAdvertisingFrameHeader) throws -> Data {
        var buffer = Data()
        try serialize(buffer: &buffer, header: header)
        return buffer
    }
    
    public func serialize(buffer : inout Data, header: ChallengeAdvertisingFrameHeader) throws {
        let frameNumber = header.frameNumber
        if(frameNumber >= ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_FRAMES) {
            throw FrameHeaderBinaryFormatError.rangeError("Frame number must be 0-\(ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_FRAMES - 1), got \(frameNumber)")
        }
        let channel = header.channel
        if(channel > 7) {
            throw FrameHeaderBinaryFormatError.rangeError("Channel number must be 0-7, got \(channel)")
        }
        let correlationId = header.correlationId
        if(correlationId > ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_CORRELATION_ID) {
            throw FrameHeaderBinaryFormatError.rangeError("Correlation id must be 0-\(ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_CORRELATION_ID), got \(correlationId)")
        }
        let clientId = header.clientId
        if(clientId > ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_CLIENT_ID) {
            throw FrameHeaderBinaryFormatError.rangeError("Client id must be 0-\(ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_CLIENT_ID), got \(clientId)")
        }

        var h : UInt8 = UInt8(channel << 5 | frameNumber)
        if(header.lastFrame) {
            h = h | ChallengeAdvertisingFrameHeaderBinaryFormat.LAST_FRAME_MASK
        }
        buffer.append(h)
        buffer.append( UInt8( (clientId >> 8) & 0xFF) )
        buffer.append( UInt8( (clientId >> 0) & 0xFF) )
        buffer.append( UInt8( correlationId) )
    }

    public func getLength() -> Int {
        return ChallengeAdvertisingFrameHeaderBinaryFormat.FRAME_HEADER_LENGTH
    }
}
