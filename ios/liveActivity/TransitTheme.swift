import SwiftUI

/// AtB design tokens replicated for the Live Activity.
///
/// Values mirror `@atb-as/theme` (AtB light mode). A Live Activity is a separate
/// bundle, so it cannot reach the JS theme — these are hardcoded for the PoC.
/// When rolling this out for real / to other flavors, generate these from the
/// theme package instead of hardcoding.
enum BrandColor {
  /// Dynamic Island keyline tint (always on a dark system background).
  static let accent = Color(hex: 0x86B200)
}

/// The AtB realtime dot. Keeps its own colors; light/dark variants come from the
/// asset catalog.
struct RealtimeIndicator: View {
  var size: CGFloat = 12

  var body: some View {
    Image("Realtime")
      .resizable()
      .aspectRatio(contentMode: .fit)
      .frame(width: size, height: size)
  }
}

enum BrandFont {
  static func primary(_ size: CGFloat) -> Font { .system(size: size, weight: .semibold) }
  static func secondary(_ size: CGFloat) -> Font { .system(size: size, weight: .regular) }
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
