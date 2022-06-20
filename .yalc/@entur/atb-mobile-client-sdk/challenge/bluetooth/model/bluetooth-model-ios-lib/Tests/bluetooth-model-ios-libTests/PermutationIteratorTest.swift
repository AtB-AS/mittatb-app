import XCTest

final class PermutationIteratorTest: XCTestCase {

    func testIterator() throws {
        print ("Start test")
        var values = ["0", "1", "2", "3"]
        let iterator = PermutationIterator(values: &values)
        var count = 0;
        for i in iterator {
            count += 1
        }
        XCTAssertEqual(count, 4*3*2*1)
    }
}
