//
//  TimeTileView.swift
//  departureWidgetExtension
//
//  Created by Adrian Hakvåg on 04/11/2022.
//

import Foundation
import SwiftUI

struct TimeTileVew: View {
    let date: Date

    var body: some View {
        Text(date, style: .time)
            .padding(8)
            .background(Color("TimeTileBackground"))
            .frame(width: 60, height: 36)
            .cornerRadius(8)
            .minimumScaleFactor(0.01)
    }
}
