import SwiftUI

/// AtB design tokens replicated for the Live Activity.
///
/// Values mirror `@atb-as/theme` (AtB light mode). A Live Activity is a separate
/// bundle, so it cannot reach the JS theme — these are hardcoded for the PoC.
/// When rolling this out for real / to other flavors, generate these from the
/// theme package instead of hardcoding.
enum BrandColor {
  // MARK: Light lock-screen card
  /// Card background (the lock-screen banner is a white card).
  static let card = Color.white
  /// Primary text on the card.
  static let title = Color(hex: 0x11242B)
  /// Secondary / muted text.
  static let subtitle = Color(hex: 0x62727A)
  /// Hairline divider between the two rows.
  static let divider = Color(hex: 0xE2E8EB)

  // MARK: Line badge (AtB city bus green)
  static let badge = Color(hex: 0x557A2A)
  static let onBadge = Color.white
  /// Fallback illustration tile (until a real artwork asset is added).
  static let illustrationBg = Color(hex: 0x3F5D1F)
  static let illustrationFg = Color(hex: 0xCFE39A)

  // MARK: Dynamic Island (always on a dark system background)
  static let diText = Color.white
  static let diSubtitle = Color(hex: 0xAEB9BF)
  static let accent = Color(hex: 0x86B200)

  /// Accent color for a transport mode (tints the badge / DI icon).
  static func mode(_ mode: TransitActivityAttributes.ContentState.Mode) -> Color {
    switch mode {
    case .bus: return badge
    case .tram: return Color(hex: 0xE07C39)
    case .rail: return Color(hex: 0x8E5FB0)
    case .water: return Color(hex: 0x279BC4)
    case .walk: return Color(hex: 0x62727A)
    }
  }

  /// SF Symbol for a transport mode.
  static func icon(_ mode: TransitActivityAttributes.ContentState.Mode) -> String {
    switch mode {
    case .bus: return "bus.fill"
    case .tram: return "tram.fill"
    case .rail: return "train.side.front.car"
    case .water: return "ferry.fill"
    case .walk: return "figure.walk"
    }
  }
}

enum BrandFont {
  static func heading(_ size: CGFloat) -> Font { .system(size: size, weight: .semibold) }
  static func body(_ size: CGFloat) -> Font { .system(size: size, weight: .regular) }
  static func bold(_ size: CGFloat) -> Font { .system(size: size, weight: .bold) }
}

extension Color {
  /// Init from a 0xRRGGBB hex literal.
  init(hex: UInt32) {
    let r = Double((hex >> 16) & 0xFF) / 255.0
    let g = Double((hex >> 8) & 0xFF) / 255.0
    let b = Double(hex & 0xFF) / 255.0
    self.init(.sRGB, red: r, green: g, blue: b, opacity: 1)
  }
}
