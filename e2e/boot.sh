device_udid=$(xcrun simctl list | grep "iPhone 13 (" | \
  awk 'match($0, /\(([-0-9A-F]+)\)/) {print substr( $0, RSTART + 1, RLENGTH-2 )}' | head -n 1)
echo "Found $device_udid for iPhone 13"
xcrun simctl boot $device_udid
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
echo "Tried pre-booting $device_udid"