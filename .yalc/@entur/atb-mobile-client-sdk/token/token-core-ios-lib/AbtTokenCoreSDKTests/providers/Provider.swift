protocol Provider {
    associatedtype T

    static var shared: Self { get }

    var defaultValue: T { get }

    init()
}
