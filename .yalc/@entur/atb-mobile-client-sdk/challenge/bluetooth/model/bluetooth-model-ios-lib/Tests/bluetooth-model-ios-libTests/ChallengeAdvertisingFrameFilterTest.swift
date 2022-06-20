//
//  ChallengeFilterTest.swift
//  
//
//  Created by Thomas Skjolberg on 10/06/2022.
//

import XCTest
@testable import bluetooth_model_ios_lib

class ChallengeAdvertisingFrameFilterTest: XCTestCase {

    func random(length: Int) -> Data {
        return Data((0 ..< length).map { _ in UInt8.random(in: UInt8.min ... UInt8.max) })
    }

    var filter = ChallengeAdvertisingFrameFilter()

    func testFilter() throws {
        var frames = Array<Data>()
        frames.reserveCapacity(655 * 25 * 3 * 15)

        for clientId in stride(from: 0, to: (65535-1000), by: 1000) {
            for correlationId in stride(from: 0, to: (256-10), by: 10) {
                for channel in stride(from: 0, to: (8-2), by: 2) {
                    for frameNumber in 0..<16 {
                        var content = random(length: 23)

                        let frame = try ChallengeAdvertisingFrameBinaryFormat.newInstance(payload: &content, offset:0, count:content.count, clientId: UInt32(clientId), frameNumber: UInt32(frameNumber), lastFrame: frameNumber == 15, correlationId: UInt32(correlationId), channel: UInt32(channel))
                        frames.append(frame.contents)
                    }
                }
            }
        }
        
        for var frame in frames {
            XCTAssertFalse(filter.hasFrame(frame: &frame))
            XCTAssertTrue(filter.hasFrame(frame: &frame))
        }
    }
}
