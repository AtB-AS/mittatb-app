//
//  File.swift
//  
//
//  Created by Thomas Skjolberg on 09/06/2022.
//

import Foundation
import OrderedCollections

enum ChallengeAdvertisingFrameBinaryFormatError: Error {
    case rangeError(String)
}

public class ChallengeAdvertisingFrameBinaryFormat {
    
    static let MAX_PAYLOAD_LENGTH = 23
    static let MAX_CORRELATION_ID = 255
    
    static let HEADER_FORMAT = ChallengeAdvertisingFrameHeaderBinaryFormat()
    
    // Legacy bluetooth Advertising Packet max size is 31
    // 2 bytes for Type fields
    // 2 bytes for Company Identifier Code
    // leaving 27 for header + payload
    
    public static func parse(buffer: inout Data) throws -> ChallengeAdvertisingFrame {
        let headerLength = ChallengeAdvertisingFrameBinaryFormat.HEADER_FORMAT.getLength()
        
        if(buffer.count <= headerLength) {
            throw ChallengeAdvertisingFrameBinaryFormatError.rangeError("Expected size > \(headerLength)")
        }
        
        if(buffer.count > headerLength + ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH) {
            throw ChallengeAdvertisingFrameBinaryFormatError.rangeError("Expected header + payload to \(headerLength + ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH) bytes or less")
        }
        
        let header = ChallengeAdvertisingFrameBinaryFormat.HEADER_FORMAT.parse(headerBytes: &buffer);

        return ChallengeAdvertisingFrame(contents: &buffer, header: header)
    }
    
    public static func newInstance(payload: inout Data, offset: Int, count: Int, clientId: UInt32, frameNumber : UInt32, lastFrame : Bool, correlationId: UInt32, channel : UInt32) throws -> ChallengeAdvertisingFrame {
        
        var buffer = Data(capacity: 27) // max bluetooth frame payload
        
        let header = ChallengeAdvertisingFrameHeader(clientId: clientId, frameNumber: frameNumber, lastFrame: lastFrame, correlationId: correlationId, channel: channel)
        
        try ChallengeAdvertisingFrameBinaryFormat.HEADER_FORMAT.serialize(buffer: &buffer, header: header)

        payload.withUnsafeBytes { buf in
            buffer.append(buf.bindMemory(to: UInt8.self).baseAddress!.advanced(by: offset), count: count)
        }
        
        return ChallengeAdvertisingFrame(contents: &buffer, header:header)
    }
    
    /**
     *
     * Parse with some sanity checking
     *
     * @param content bytes to parse
     * @return a frame, or null if checks did not pass
     */

    
    public static func parseOrNull(content: inout Data) throws -> ChallengeAdvertisingFrame? {
        if(isValid(content: &content)) {
            return try parse(buffer: &content)
        }
        
        return nil
    }
    
    public static func isValid(content: inout Data) -> Bool {
        let headerLength = ChallengeAdvertisingFrameBinaryFormat.HEADER_FORMAT.getLength()
        return content.count > headerLength && content.count <= headerLength + ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH
    }
    
    public static func fromPayload(frames: inout Array<ChallengeAdvertisingFrame>, bytes: inout Data, clientId: Int, correlationId: Int, channel: Int) throws {
        let boundedCorrelationId = UInt32(correlationId % ChallengeAdvertisingFrameBinaryFormat.MAX_CORRELATION_ID)
        
        let count = bytes.count
        var numFrames = count / ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH
        if (count % ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH > 0) {
           numFrames += 1
        }
        
        for i in 0 ..< numFrames {
            let copyStart = i * ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH
            let copyLength = min(count - copyStart, ChallengeAdvertisingFrameBinaryFormat.MAX_PAYLOAD_LENGTH)

            let frame = try newInstance(payload: &bytes, offset:copyStart, count:copyLength, clientId: UInt32(clientId), frameNumber: UInt32(i), lastFrame: (numFrames - 1 == i), correlationId: boundedCorrelationId, channel: UInt32(channel));
            
            frames.append(frame)
        }
    }

    public static func toPayload(frames: inout Array<ChallengeAdvertisingFrame>, count: Int) -> Data {
        var merge = Data()
        let headerLength = ChallengeAdvertisingFrameBinaryFormat.HEADER_FORMAT.getLength()
        for i in 0..<count {
            let frame = frames[i];
            merge.append(contentsOf: frame.contents[headerLength...])
        }
        return merge
    }

    public static func toPayload(frames: inout Array<ChallengeAdvertisingFrame?>, count: Int) -> Data {
        var merge = Data()
        let headerLength = ChallengeAdvertisingFrameBinaryFormat.HEADER_FORMAT.getLength()
        for i in 0..<count {
            let frame = frames[i];
            merge.append(contentsOf: frame!.contents[headerLength...])
        }
        return merge
    }
    
    
}
