//
//  Frame assembler
//  
//
//  Created by Thomas Skjolberg on 13/06/2022.
//

import Foundation

// https://www.swiftbysundell.com/articles/caching-in-swift/
final class Cache<Key: Hashable, Value> {
    private let wrapped = NSCache<WrappedKey, Entry>()

    func insert(_ value: Value, forKey key: Key) {
        let entry = Entry(value: value)
        wrapped.setObject(entry, forKey: WrappedKey(key))
    }

    func value(forKey key: Key) -> Value? {
        let entry = wrapped.object(forKey: WrappedKey(key))
        return entry?.value
    }

    func removeValue(forKey key: Key) {
        wrapped.removeObject(forKey: WrappedKey(key))
    }
    
    func clear() {
        wrapped.removeAllObjects()
    }
}

private extension Cache {
    final class WrappedKey: NSObject {
        let key: Key

        init(_ key: Key) { self.key = key }

        override var hash: Int { return key.hashValue }

        override func isEqual(_ object: Any?) -> Bool {
            guard let value = object as? WrappedKey else {
                return false
            }

            return value.key == key
        }
    }
}

private extension Cache {
    final class Entry {
        let value: Value

        init(value: Value) {
            self.value = value
        }
    }
}

extension Cache {
    subscript(key: Key) -> Value? {
        get { return value(forKey: key) }
        set {
            guard let value = newValue else {
                // If nil was assigned using our subscript,
                // then we remove any value for that key:
                removeValue(forKey: key)
                return
            }

            insert(value, forKey: key)
        }
    }
}

// added so that we are passing references not (copying) values
class ChallengeAdvertisingFrameArray {
    
    var values = [ChallengeAdvertisingFrame?](repeating: nil, count: ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_FRAMES)
    
    func getCompleteCount() -> Int {
        for i in 0..<values.count {
            if(values[i] == nil) {
                return -1
            }
            if(values[i]!.header.lastFrame) {
                return i + 1;
            }
        }
        return -1
    }
    
    func getLastFrameIndex() -> Int {
        for i in 0..<values.count {
            let frame = values[i];
            if(frame == nil) {
                continue
            }
            if(frame!.header.lastFrame) {
                return i;
            }
        }
        return -1
    }
    
}

public class ChallengeAdvertisingFrameAssembler {
    
    static let FORMAT = ChallengeAdvertisingFrameBinaryFormat()
    
    // implementation note:
    // use an array to cache each group, so that new frames always overwrite the old frames
    // i.e. not a set type construction where the same header with different payload exists
    // within the same cache
    
    // cache instead of dictionary to allow for memory eviction
    // and dictionary retains TODO
    private var framesByGroup = Cache<ChallengeAdvertisingFrameGroupHeader, ChallengeAdvertisingFrameArray>()
    
    public func addFrame(newFrame : ChallengeAdvertisingFrame) -> Data? {
        let h = newFrame.header
        let frameKey = ChallengeAdvertisingFrameGroupHeader(h: h)
        let framesForNonceKey = computeIfAbsent(key: frameKey)
        var completeCount = framesForNonceKey.getCompleteCount()
        if(completeCount != -1) {
            return nil
        }
        
        // make sure we only accept frames which are within the last frame's frame number
        // i.e. discarding too high frame numbers when a new last frame is added,
        // discarding too high frame numbers when a last frame exists,
        // discarding old last frames when a new last frame is added
        
        // discard other frame which are last
        if(newFrame.header.lastFrame) {
            let newLastFrameNumber = Int(newFrame.header.frameNumber)
            for i in 0..<newLastFrameNumber {
                if let frame = framesForNonceKey.values[i] {
                    if(frame.header.lastFrame) {
                        framesForNonceKey.values[i] = nil
                    }
                }
            }
            
            // clear any frame above the new last frame
            for i in (newLastFrameNumber+1)..<framesForNonceKey.values.count {
                framesForNonceKey.values[i] = nil
            }
        } else {
            // if we already have the last frame, check that the new frame is within the right range
            // note: it is possible here that the new frame overwrites the previous last frame
            let last = framesForNonceKey.getLastFrameIndex()
            if(last != -1 && newFrame.header.frameNumber > last) {
                // discard the frame
                return nil
            }
        }
        
        framesForNonceKey.values[Int(newFrame.header.frameNumber)] = newFrame

        completeCount = framesForNonceKey.getCompleteCount()
        if(completeCount != -1) {
            return ChallengeAdvertisingFrameBinaryFormat.toPayload(frames: &framesForNonceKey.values, count: completeCount)
        }
        
        return nil
    }
    
    func computeIfAbsent(key : ChallengeAdvertisingFrameGroupHeader) -> ChallengeAdvertisingFrameArray {
        var framesForNonceKey = framesByGroup[key]
        framesForNonceKey = framesByGroup[key]
        if(framesForNonceKey != nil) {
            return framesForNonceKey!
        }
        let newFramesForNonceKey = ChallengeAdvertisingFrameArray()
        framesByGroup[key] = newFramesForNonceKey
        return newFramesForNonceKey
    }
    
    public func clear() {
        framesByGroup.clear()
    }
    
}
