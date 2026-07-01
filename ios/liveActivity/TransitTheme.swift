import SwiftUI

/// AtB design tokens replicated for the Live Activity.
///
/// Values mirror `@atb-as/theme` (AtB "light"/"dark" mode). A Live Activity is a
/// separate bundle, so it cannot reach the JS theme — these are hardcoded for the
/// PoC. When we roll this out for real / to other flavors, generate these from the
/// theme package instead of hardcoding.
enum BrandColor {
  /// Card background for the Live Activity surface (dark, brand neutral).
  static let background = Color(hex: 0x2B353A)
  /// Slightly raised surface (e.g. a chip background).
  static let surface = Color(hex: 0x37424A)

  /// Primary text on the dark card.
  static let text = Color.white
  /// Secondary / muted text.
  static let textSecondary = Color(hex: 0xB6C2C8)

  /// AtB primary (olive/green).
  static let primary = Color(hex: 0x86B200)
  /// Alert / "stopping now" red (status error, dark variant).
  static let alert = Color(hex: 0xEC576B)

  /// Foreground color that reads well on a colored line badge.
  static let onBadge = Color(hex: 0x11242B)

  /// Blue of the Norwegian bus-stop sign shown next to stop names.
  static let stopSign = Color(hex: 0x3A7BD5)

  /// Accent color for a given transport mode (used to tint the line badge + icon).
  static func mode(_ mode: TransitActivityAttributes.ContentState.Mode) -> Color {
    switch mode {
    case .bus: return Color(hex: 0xA9D22D) // city bus green
    case .tram: return Color(hex: 0xE07C39) // tram orange
    case .rail: return Color(hex: 0x8E5FB0) // rail purple
    case .water: return Color(hex: 0x279BC4) // boat blue
    case .walk: return Color(hex: 0xB6C2C8)
    }
  }

  /// SF Symbol name for a given transport mode.
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
