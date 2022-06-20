//
//  ChallengeAdvertisingFrameHeaderBinaryFormatTest.swift
//  
//
//  Created by Thomas Skjolberg on 09/06/2022.
//

import XCTest
@testable import bluetooth_model_ios_lib

class ChallengeAdvertisingFrameHeaderBinaryFormatTest: XCTestCase {

    let FORMAT = ChallengeAdvertisingFrameHeaderBinaryFormat()

    func testHeader1() throws {
        let clientId : UInt32 = 123
        let frameNo : UInt32 = 11
        let correlationId : UInt32 = 200
        let channel : UInt32 = 2
        
        let h = ChallengeAdvertisingFrameHeader(clientId: clientId, frameNumber: frameNo, lastFrame: false, correlationId: correlationId, channel: channel)
        
        var encoded = try FORMAT.serialize(header: h);
        
        let parsed = FORMAT.parse(headerBytes: &encoded)

        XCTAssertEqual(clientId, parsed.clientId)
        XCTAssertEqual(frameNo, parsed.frameNumber)
        XCTAssertEqual(correlationId, parsed.correlationId)
        XCTAssertEqual(channel, parsed.channel)
        XCTAssertEqual(h, parsed)
    }

    func testHeader2() throws {
        let clientId : UInt32 = 3
        let frameNo : UInt32 = 5
        let correlationId : UInt32 = 100
        let channel : UInt32 = 4
        
        let h = ChallengeAdvertisingFrameHeader(clientId: clientId, frameNumber: frameNo, lastFrame: true, correlationId: correlationId, channel: channel)
        
        var encoded = try FORMAT.serialize(header: h);
        
        let parsed = FORMAT.parse(headerBytes: &encoded)

        XCTAssertEqual(clientId, parsed.clientId)
        XCTAssertEqual(frameNo, parsed.frameNumber)
        XCTAssertEqual(correlationId, parsed.correlationId)
        XCTAssertEqual(channel, parsed.channel)
        XCTAssertTrue(parsed.lastFrame)
        XCTAssertEqual(h, parsed)
    }
    
    func testInvalidChannel() {
        let header = ChallengeAdvertisingFrameHeader(clientId: 0, frameNumber: 0, lastFrame: false, correlationId: 0, channel: 999)
        
        XCTAssertThrowsError(try FORMAT.serialize(header: header)) { error in
            guard case FrameHeaderBinaryFormatError.rangeError(_) = error else {
                return XCTFail()
            }
        }
    }
    
    func testInvalidFrameNumber() {
        let header = ChallengeAdvertisingFrameHeader(clientId: 0, frameNumber: 100, lastFrame: false, correlationId: 0, channel: 0)
        
        XCTAssertThrowsError(try FORMAT.serialize(header: header)) { error in
            guard case FrameHeaderBinaryFormatError.rangeError(_) = error else {
                return XCTFail()
            }
        }
    }
    
    func testInvalidClientId() {
        let header = ChallengeAdvertisingFrameHeader(clientId: UInt32.max, frameNumber: 0, lastFrame: false, correlationId: 0, channel: 0)
        
        XCTAssertThrowsError(try FORMAT.serialize(header: header)) { error in
            guard case FrameHeaderBinaryFormatError.rangeError(_) = error else {
                return XCTFail()
            }
        }
    }
    
    func testInvalidCorrelationId() {
        let header = ChallengeAdvertisingFrameHeader(clientId: 0, frameNumber: 0, lastFrame: false, correlationId: UInt32.max, channel: 2)
        
        XCTAssertThrowsError(try FORMAT.serialize(header: header)) { error in
            guard case FrameHeaderBinaryFormatError.rangeError(_) = error else {
                return XCTFail()
            }
        }
    }

}
