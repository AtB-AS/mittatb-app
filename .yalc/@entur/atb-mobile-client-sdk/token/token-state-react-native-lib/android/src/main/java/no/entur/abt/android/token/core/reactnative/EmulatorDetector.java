package no.entur.abt.android.token.core.reactnative;

import android.os.Build;

public class EmulatorDetector {

	protected static final String GENERIC = "generic";
	protected static final String UNKNOWN = "unknown";
	protected static final String GOLDFISH = "goldfish";
	protected static final String RANCHU = "ranchu";
	protected static final String GOOGLE_SDK = "google_sdk";
	protected static final String GENYMOTION = "Genymotion";
	protected static final String EMULATOR = "Emulator";
	protected static final String VBOX_86_P = "vbox86p";
	protected static final String EMULATOR1 = "emulator";
	protected static final String SIMULATOR = "simulator";
	protected static final String SDK = "sdk";
	protected static final String SDK_X_86 = "sdk_x86";
	protected static final String SDK_GOOGLE = "sdk_google";
	protected static final String ANDROID_SDK_BUILT_FOR_X_86 = "Android SDK built for x86";

	/*
	 * Detect whether we are running an emulator.
	 */
	public static boolean isRunningOnEmulator() {
		return (Build.BRAND.startsWith(GENERIC) && Build.DEVICE.startsWith(GENERIC)) || Build.FINGERPRINT.startsWith(GENERIC)
				|| Build.FINGERPRINT.startsWith(UNKNOWN) || Build.HARDWARE.contains(GOLDFISH) || Build.HARDWARE.contains(RANCHU)
				|| Build.MODEL.contains(GOOGLE_SDK) || Build.MODEL.contains(EMULATOR) || Build.MODEL.contains(ANDROID_SDK_BUILT_FOR_X_86)
				|| Build.MANUFACTURER.contains(GENYMOTION) || Build.PRODUCT.contains(SDK_GOOGLE) || Build.PRODUCT.contains(GOOGLE_SDK)
				|| Build.PRODUCT.contains(SDK) || Build.PRODUCT.contains(SDK_X_86) || Build.PRODUCT.contains(VBOX_86_P) || Build.PRODUCT.contains(EMULATOR1)
				|| Build.PRODUCT.contains(SIMULATOR);
	}
}
