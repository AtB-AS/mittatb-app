//
//  File.swift
//  
//
//  Created by Thomas Skjolberg on 10/06/2022.
//

import XCTest
@testable import bluetooth_model_ios_lib

class ChallengeAdvertisingFrameBinaryFormatTest: XCTestCase {

    let FORMAT = ChallengeAdvertisingFrameBinaryFormat()

    func random(length: Int) -> Data {
        return Data((0 ..< length).map { _ in UInt8.random(in: UInt8.min ... UInt8.max) })
    }

    func testRoundtrip() throws {
        for i in stride(from: 16, to: 256, by: 16) {
            var frames = Array<ChallengeAdvertisingFrame>()
            var content = random(length:i)
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames, bytes: &content, clientId: i, correlationId: i*2, channel: 0)
            
            assertCompleteFrameSet(frames: &frames)
            let reconstructed = ChallengeAdvertisingFrameBinaryFormat.toPayload(frames: &frames, count:frames.count);
            XCTAssertEqual(content, reconstructed)
        }
    }
    
    func assertCompleteFrameSet(frames: inout Array<ChallengeAdvertisingFrame>) {
        XCTAssertFalse(frames.isEmpty)
            
        let lastHeader = frames.last!.header;
       
        XCTAssertTrue(lastHeader.lastFrame);
        
        for frame in frames[0..<(frames.count - 1)] {
            XCTAssertFalse(frame.header.lastFrame)
        }
        
        let frameIndexes = Set(frames.map({$0.header.frameNumber}))
        for frameIndex in frameIndexes {
            XCTAssertFalse(frameIndex >= frames.count)
        }

        let correlationId = Set(frames.map({$0.header.correlationId}))
        let channels = Set(frames.map({$0.header.channel}))
        let clientIds = Set(frames.map({$0.header.clientId}))

        XCTAssertEqual(frameIndexes.count, Int(lastHeader.frameNumber) + 1)
        XCTAssertEqual(correlationId.count, 1)
        XCTAssertEqual(channels.count, 1)
        XCTAssertEqual(clientIds.count, 1)
    }

}
