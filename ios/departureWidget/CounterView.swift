import Foundation
import SwiftUI

struct CounterView: View {
    @State private var time = 1.0

    @State var currentDate = Date()
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        Text("\(time)").onReceive(timer) { _ in
            time += 1
        }
    }
}
