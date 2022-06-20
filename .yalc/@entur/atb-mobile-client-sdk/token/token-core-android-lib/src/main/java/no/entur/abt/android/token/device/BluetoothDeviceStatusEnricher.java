package no.entur.abt.android.token.device;

import static androidx.core.content.PermissionChecker.PERMISSION_GRANTED;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Build;

import androidx.core.content.ContextCompat;

import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

public class BluetoothDeviceStatusEnricher extends AbstractDeviceStatusEnricher {

	public BluetoothDeviceStatusEnricher(Context context) {
		super(context);
	}

	@Override
	public void enrich(List<DeviceStatus> list) {
		list.add(getBluetoothStatus());
	}

	private DeviceStatus getBluetoothStatus() {

		BluetoothAdapter bluetoothAdapter;
		try {
			BluetoothManager bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
			if (bluetoothManager == null) {
				return DeviceStatus.DEVICE_STATUS_BLUETOOTH_UNSUPPORTED_ON_DEVICE;
			}
			bluetoothAdapter = bluetoothManager.getAdapter();
		} catch (Throwable e) {
			// getSystemService has been seen crashing on some devices
			bluetoothAdapter = getBluetoothAdapterLegacy();
		}

		if (bluetoothAdapter == null) {
			return DeviceStatus.DEVICE_STATUS_BLUETOOTH_UNSUPPORTED_ON_DEVICE;
		}

		// https://developer.android.com/guide/topics/connectivity/bluetooth/permissions

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
			if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_SCAN) != PERMISSION_GRANTED) {
				return DeviceStatus.DEVICE_STATUS_BLUETOOTH_NO_PERMISSION;
			}
		} else {
			if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_ADMIN) != PERMISSION_GRANTED) {
				return DeviceStatus.DEVICE_STATUS_BLUETOOTH_NO_PERMISSION;
			}
		}

		if (bluetoothAdapter.isEnabled()) {
			return DeviceStatus.DEVICE_STATUS_BLUETOOTH_ENABLED;
		}
		return DeviceStatus.DEVICE_STATUS_BLUETOOTH_DISABLED;
	}

	@SuppressWarnings("deprecation")
	private BluetoothAdapter getBluetoothAdapterLegacy() {
		try {
			return BluetoothAdapter.getDefaultAdapter();
		} catch (Throwable e) {
			// some day this might blow up with method not found
			return null;
		}
	}
}
