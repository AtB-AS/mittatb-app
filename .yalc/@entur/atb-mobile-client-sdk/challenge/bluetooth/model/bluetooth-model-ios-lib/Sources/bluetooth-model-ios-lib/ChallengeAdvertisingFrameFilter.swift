//
//  Very simple filter for frames. This filter is not intended to be accurate, but rather relies on hash statistics to filter 'most of the frames' seen before.
//  
//
//  Created by Thomas Skjolberg on 10/06/2022.
//

import Foundation
import zlib

public class ChallengeAdvertisingFrameFilter {
    
    static let SIZE = 128
    
    var frames: [Data?]
    
    init() {
        frames = Array<Data?>()
        for _ in 0..<ChallengeAdvertisingFrameFilter.SIZE {
            frames.append(nil)
        }
    }
    
    public func hasFrame(frame: inout Data) -> Bool {
        if(frame.count <= 4) {
            return false
        }
        
        let hash = hash(frame: &frame)
        let previous = frames[hash]
        if(previous != nil) {
            let data = previous!
            if(data == frame) {
                return true
            }
        }
        frames[hash] = frame
        return false
    }
    
    public func hash(frame: inout Data) -> Int {
        let checksum = frame.withUnsafeBytes { crc32(0, $0.bindMemory(to: Bytef.self).baseAddress, uInt(frame.count)) }
        return abs(Int(checksum)) % ChallengeAdvertisingFrameFilter.SIZE
    }
    
    public func clear() {
        for i in 0..<frames.count {
            frames[i] = nil
        }
    }
    
}
