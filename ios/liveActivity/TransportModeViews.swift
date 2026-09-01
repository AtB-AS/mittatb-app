import SwiftUI

/// Presentation for `TransportMode`: accent color, icon asset, and the views that
/// render them. The mode itself lives in `Shared/TransportMode.swift` because the
/// app target needs it to encode a content-state; this half depends on
/// `TransitTheme.swift` and is compiled into the extension only.
///
/// The color values mirror `@atb-as/theme` (AtB light mode) — see the note in
/// `TransitTheme.swift` about hardcoding them for the PoC.
extension TransportMode {
  /// Accent color for the mode — tints the line badge and the Dynamic Island icon.
  var color: Color {
    switch self {
    case .bus: return Color(hex: 0x557A2A)
    case .tram: return Color(hex: 0xE07C39)
    case .rail: return Color(hex: 0x8E5FB0)
    case .water: return Color(hex: 0x279BC4)
    case .walk: return Color(hex: 0x62727A)
    }
  }

  /// Text/icon color on top of `color`.
  var onColor: Color { .white }

  /// AtB transport-mode icon asset (see `Assets.xcassets/TransportModes`).
  var iconName: String {
    switch self {
    case .bus: return "BusFill"
    case .tram: return "TramFill"
    case .rail: return "TrainFill"
    case .water: return "FerryFill"
    case .walk: return "WalkFill"
    }
  }
}

/// An AtB transport-mode icon, tinted by the surrounding `foregroundStyle`.
struct ModeIcon: View {
  let mode: TransportMode
  let size: CGFloat
  /// Tint with the mode's own accent color instead of inheriting the
  /// surrounding `foregroundStyle`.
  let colored: Bool

  init(_ mode: TransportMode, size: CGFloat, colored: Bool = false) {
    self.mode = mode
    self.size = size
    self.colored = colored
  }

  var body: some View {
    let icon =
      Image(mode.iconName)
      .renderingMode(.template)
      .resizable()
      .aspectRatio(contentMode: .fit)
      .frame(width: size, height: size)

    if colored {
      icon.foregroundStyle(mode.color)
    } else {
      icon
    }
  }
}

/// A line badge: a capsule with a mode icon + line number, e.g. "🚌 3".
struct LineBadge: View {
  let mode: TransportMode
  let number: String
  /// Icon size. The line number's font and the capsule padding scale with it.
  var size: CGFloat = 20

  var body: some View {
    HStack(spacing: size * 0.2) {
      ModeIcon(mode, size: size)
      if !number.isEmpty {
        Text(number).font(BrandFont.primary(size * 0.8))
      }
    }
    .foregroundStyle(mode.onColor)
    .padding(size * 0.4)
    .background(mode.color, in: Capsule())
  }
}
