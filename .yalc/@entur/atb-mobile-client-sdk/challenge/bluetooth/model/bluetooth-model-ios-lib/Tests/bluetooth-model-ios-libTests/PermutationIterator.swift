//
//  PermutationIterator.swift
//  test class

import Foundation

class PermutationIterator<T> : Sequence, IteratorProtocol {
    
    let values: [T];
    var permutations: [Int]
    var morePermutations = true
    
    init(values: inout [T]) {
        self.values = values;
        self.permutations = Array(0...values.count - 1)
    }

    public typealias Element = Array<T>
    
    func next() -> Element? {
        if(!morePermutations) {
            return nil
        }
        
        var result = Array<T>()
        for permutation in permutations {
            result.append(values[permutation])
        }
        morePermutations = nextPermuation() != -1;
        return result
    }
    
    func nextPermuation() -> Int {
        // find logest non-increasing suffix
        var i : Int = permutations.count - 1;
        while(i > 0 && permutations[i - 1] >= permutations[i]) {
            i -= 1;
        }
        
        if(i <= 0) {
            return -1;
        }
        
        var j = permutations.count - 1;
        while(permutations[j] <= permutations[i - 1]) {
            j -= 1;
        }

        let head = i - 1;
        
        var tmp = permutations[i - 1];
        
        permutations[i - 1] = permutations[j];
        permutations[j] = tmp;
        
        j = permutations.count - 1;
        while(i < j) {
            tmp = permutations[i]
            permutations[i] = permutations[j]
            permutations[j] = tmp
            i += 1
            j -= 1
        }
        
        return head;
    }
    
}
