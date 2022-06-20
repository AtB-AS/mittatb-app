//
//  File.swift
//  
//
//  Created by Thomas Skjolberg on 13/06/2022.
//

import Foundation


import XCTest
@testable import bluetooth_model_ios_lib

class ChallengeAdvertisingFrameAssemblerTest: XCTestCase {
    
    func random(length: Int) -> Data {
        return Data((0 ..< length).map { _ in UInt8.random(in: UInt8.min ... UInt8.max) })
    }
    
    func getPayloads() -> Array<Data> {
        var result = Array<Data>()
        for i in 0..<4 {
            result.append(random(length: 23 * 4 - i))
        }
        return result
    }
    
    func testAssembleNonceFromAnySequenceFrames() throws {
        let payloads = getPayloads()
        for var payload in payloads {
            var frames = Array<ChallengeAdvertisingFrame>()

            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames, bytes: &payload, clientId: 0, correlationId: 1, channel: 2)
            XCTAssertEqual(4, frames.count)

            let framesIterator = PermutationIterator(values: &frames)
            for var sequence in framesIterator {
                assertReassembly(payload: &payload, sequence: &sequence)
            }
        }
    }

    func testValues() throws {
        let payloads = getPayloads()
        for var payload in payloads {
            var frames = Array<ChallengeAdvertisingFrame>()
            print("Max is \(ushort.max)")
            
            for i in 0..<Int(ushort.max) {
                try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames, bytes: &payload, clientId: i, correlationId: 1, channel: 2)
                assertReassembly(payload: &payload, sequence: &frames)
                frames.removeAll()
            }
            for i in 0..<Int(ushort.max) {
                try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames, bytes: &payload, clientId: 1, correlationId: i, channel: 2)
                assertReassembly(payload: &payload, sequence: &frames)
                frames.removeAll()
            }
            for i in 0..<8 {
                try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames, bytes: &payload, clientId: 0, correlationId: 1, channel: i)
                assertReassembly(payload: &payload, sequence: &frames)
                frames.removeAll()
            }
        }
    }
    
    func assertReassembly(payload: inout Data, sequence: inout Array<ChallengeAdvertisingFrame>) {
        let assembler = ChallengeAdvertisingFrameAssembler()
        
        for i in 0..<(sequence.count - 1) {
            if(assembler.addFrame(newFrame: sequence[i]) != nil) {
                XCTFail()
            }
        }
        
        let deserialized = assembler.addFrame(newFrame: sequence[sequence.count - 1])
        if(deserialized == nil) {
            XCTFail()
        }
        if(!payload.elementsEqual(deserialized!)) {
            XCTFail()
        }
    }
    
    func testNonRepeatingCallbackOnNewChallenge() throws {
        let payloads = getPayloads()
        for var payload in payloads {
            var allFrames = Array<ChallengeAdvertisingFrame>()
            var frames = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames, bytes: &payload, clientId: 0, correlationId: 1, channel: 2)
            
            let framesIterator = PermutationIterator(values: &frames)
            for sequence in framesIterator {
                allFrames.append(contentsOf: sequence)
            }

            var numNonceFoundCount = 0
            let assembler = ChallengeAdvertisingFrameAssembler()
            for frame in allFrames {
                if(assembler.addFrame(newFrame: frame) != nil) {
                    numNonceFoundCount += 1
                }
            }

            XCTAssertEqual(1, numNonceFoundCount)
        }
    }

    func testTwoDifferentClientIds() throws {
        let payloads1 = getPayloads()
        let payloads2 = getPayloads()

        for k in 0..<payloads1.count {
            var payload1 = payloads1[k]
            var payload2 = payloads2[k]
            
            var frames1 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames1, bytes: &payload1, clientId: 0, correlationId: 1, channel: 2)

            var frames2 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames2, bytes: &payload2, clientId: 2, correlationId: 1, channel: 2)

            assertAssemblesAsTwo(frames1: frames1, frames2: frames2)
        }
    }
    
    func assertAssemblesAsTwo(frames1: Array<ChallengeAdvertisingFrame>, frames2: Array<ChallengeAdvertisingFrame>) {
        let assembler = ChallengeAdvertisingFrameAssembler()

        var count = 0
        for i in 0..<frames1.count {
            if(assembler.addFrame(newFrame: frames1[i]) != nil) {
                count += 1
            }
            if(assembler.addFrame(newFrame: frames2[i]) != nil) {
                count += 1
            }
        }

        XCTAssertEqual(2, count)
    }
    
    func testTwoDifferentCorrelationId() throws {
        let payloads1 = getPayloads()
        let payloads2 = getPayloads()

        for k in 0..<payloads1.count {
            var payload1 = payloads1[k]
            var payload2 = payloads2[k]
            
            var frames1 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames1, bytes: &payload1, clientId: 1, correlationId: 2, channel: 2)

            var frames2 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames2, bytes: &payload2, clientId: 1, correlationId: 3, channel: 2)

            assertAssemblesAsTwo(frames1: frames1, frames2: frames2)
        }
    }

    func testTwoDifferentChannelIds() throws {
        let payloads1 = getPayloads()
        let payloads2 = getPayloads()

        for k in 0..<payloads1.count {
            var payload1 = payloads1[k]
            var payload2 = payloads2[k]
            
            var frames1 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames1, bytes: &payload1, clientId: 1, correlationId: 2, channel: 1)

            var frames2 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames2, bytes: &payload2, clientId: 1, correlationId: 2, channel: 2)

            assertAssemblesAsTwo(frames1: frames1, frames2: frames2)
        }
    }

    func testAssembleNonceDiscardsPreviousLastFrame() throws {
        let payloads1 = getPayloads()

        for k in 0..<payloads1.count {
            var payload1 = payloads1[k]

            let assembler = ChallengeAdvertisingFrameAssembler()
            
            var frames1 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames1, bytes: &payload1, clientId: 1, correlationId: 2, channel: 1)

            for i in 0..<(frames1.count - 1) {
                XCTAssertNil(assembler.addFrame(newFrame: frames1[i]))
            }
        
            var jitterPayload = random(length: 3);
            let jitterHeader = ChallengeAdvertisingFrameHeader(clientId: 1, frameNumber: 6, lastFrame: true, correlationId: 2, channel: 1)
            let jitterFrame = ChallengeAdvertisingFrame(contents: &jitterPayload, header:jitterHeader)

            XCTAssertNil(assembler.addFrame(newFrame: jitterFrame))

            XCTAssertNotNil(assembler.addFrame(newFrame: frames1[frames1.count-1]))
        }
    }
    
    func testAssembleNonceDiscardsFrameWithTooHighFrameNumberForNewLastFrame() throws {
        
        let payloads1 = getPayloads()

        for k in 0..<payloads1.count {
            var payload1 = payloads1[k]

            let assembler = ChallengeAdvertisingFrameAssembler()
            
            var frames1 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames1, bytes: &payload1, clientId: 1, correlationId: 2, channel: 1)

            for i in 0..<(frames1.count - 1) {
                XCTAssertNil(assembler.addFrame(newFrame: frames1[i]))
            }
        
            var jitterPayload = random(length: 3);
            let jitterHeader = ChallengeAdvertisingFrameHeader(clientId: 1, frameNumber: 6, lastFrame: false, correlationId: 2, channel: 1)
            let jitterFrame = ChallengeAdvertisingFrame(contents: &jitterPayload, header:jitterHeader)

            XCTAssertNil(assembler.addFrame(newFrame: jitterFrame))

            XCTAssertNotNil(assembler.addFrame(newFrame: frames1[frames1.count-1]))
        }
    }

    func testAssembleNonceDiscardsPreexistingFrameWithTooHighFrameNumberForNewLastFrame() throws {
        
        let payloads1 = getPayloads()

        for k in 0..<payloads1.count {
            var payload1 = payloads1[k]

            let assembler = ChallengeAdvertisingFrameAssembler()

            var frames1 = Array<ChallengeAdvertisingFrame>()
            try ChallengeAdvertisingFrameBinaryFormat.fromPayload(frames: &frames1, bytes: &payload1, clientId: 1, correlationId: 2, channel: 1)

            var jitterPayload = random(length: 3);
            let jitterHeader = ChallengeAdvertisingFrameHeader(clientId: 1, frameNumber: 6, lastFrame: false, correlationId: 2, channel: 1)
            let jitterFrame = ChallengeAdvertisingFrame(contents: &jitterPayload, header:jitterHeader)

            XCTAssertNil(assembler.addFrame(newFrame: frames1[frames1.count-1]))

            XCTAssertNil(assembler.addFrame(newFrame: jitterFrame))
            
            for i in 0..<(frames1.count - 2) {
                XCTAssertNil(assembler.addFrame(newFrame: frames1[i]))
            }
        
            XCTAssertNotNil(assembler.addFrame(newFrame: frames1[frames1.count-2]))
        }
    }


}
