
/**
 * Advertising frame <br>
 * <br>
 * - Header 4 bytes<br>
 * - Payload (1-23 bytes)<br>
 * <br>
 * So in total up to 27 bytes.
 */

import Foundation

public class ChallengeAdvertisingFrame : Comparable, Hashable, CustomStringConvertible {
    
    public static func < (lhs: ChallengeAdvertisingFrame, rhs: ChallengeAdvertisingFrame) -> Bool {
        return lhs.header < rhs.header
    }
    
    public static func == (lhs: ChallengeAdvertisingFrame, rhs: ChallengeAdvertisingFrame) -> Bool {
        return lhs.contents.elementsEqual(rhs.contents)
    }
    
    let header: ChallengeAdvertisingFrameHeader
    let contents: Data
    
    public var description: String {
        return header.description
    }
    
    init(contents: inout Data, header: ChallengeAdvertisingFrameHeader) {
        self.contents = contents
        self.header = header
    }
    
    public func hash(into hasher: inout Hasher) {
        hasher.combine(contents)
    }

}
