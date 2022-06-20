package no.entur.abt.android.token.device;

import android.content.Context;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;

import java.io.InputStream;
import java.util.List;
import java.util.Scanner;

import uk.org.netex.www.netex.DeviceInfoElement;
import uk.org.netex.www.netex.DeviceInfoType;

public class OsDeviceInfoElementEnricher implements DeviceInfoElementEnricher {

	public static final String FIRST_API_LEVEL = "ro.product.first_api_level";

	private final Context context;

	public OsDeviceInfoElementEnricher(Context context) {
		this.context = context;
	}

	@Override
	public void enrich(List<DeviceInfoElement> list) {
		// app
		// device
		list.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_MANUFACTURER).setValue(getManufacturer()).build());
		list.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_MODEL_ID).setValue(getModel()).build());
		list.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_DEVICE_ID).setValue(getDeviceId()).build());
		list.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_OS_VERSION).setValue(getRelease()).build());
		list.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_OS_API_LEVEL).setValue(getOsApiLevel()).build());

		list.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_INITIAL_OS_API_LEVEL).setValue(getInitialOsApiLevel()).build());
	}

	@NonNull
	public String getOsApiLevel() {
		return Integer.toString(Build.VERSION.SDK_INT);
	}

	public String getManufacturer() {
		return Build.MANUFACTURER;
	}

	public String getModel() {
		return Build.MODEL;
	}

	public String getRelease() {
		return Build.VERSION.RELEASE;
	}

	public String getInitialOsApiLevel() {
		String initialOsApiLevel = getProperty(FIRST_API_LEVEL, "-1");
		return initialOsApiLevel;
	}

	protected static boolean isEmpty(CharSequence cs) {
		return cs == null || cs.length() == 0;
	}

	@SuppressWarnings("HardwareIds")
	private String getDeviceId() {
		String deviceId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
		if (isEmpty(deviceId)) {
			// Certain devices (at least LG-AS110) will produce empty strings for ANDROID_ID. Set value indicating id is not available (as empty string is not
			// allowed)
			deviceId = "N/A";
		}
		return deviceId;
	}

	public String getProperty(String property, String defaultValue) {
		try {
			Process process = new ProcessBuilder("getprop", property).start();
			try (InputStream in = process.getInputStream(); Scanner scanner = new Scanner(in);) {
				String value = scanner.nextLine().trim();
				return (value.isEmpty()) ? defaultValue : value;
			}
		} catch (Exception e) {
			return defaultValue;
		}
	}

}
