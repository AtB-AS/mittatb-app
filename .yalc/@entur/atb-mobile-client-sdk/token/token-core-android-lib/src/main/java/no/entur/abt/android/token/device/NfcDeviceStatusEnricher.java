package no.entur.abt.android.token.device;

import static androidx.core.content.PermissionChecker.PERMISSION_GRANTED;

import android.Manifest;
import android.content.Context;
import android.nfc.NfcAdapter;

import androidx.core.content.ContextCompat;

import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

public class NfcDeviceStatusEnricher extends AbstractDeviceStatusEnricher {

	public NfcDeviceStatusEnricher(Context context) {
		super(context);
	}

	@Override
	public void enrich(List<DeviceStatus> list) {
		list.add(getNfcStatus());
	}

	private DeviceStatus getNfcStatus() {
		NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(context);

		if (nfcAdapter == null) {
			return DeviceStatus.DEVICE_STATUS_NFC_UNSUPPORTED_ON_DEVICE;
		}
		if (ContextCompat.checkSelfPermission(context, Manifest.permission.NFC) != PERMISSION_GRANTED) {
			return DeviceStatus.DEVICE_STATUS_NFC_NO_PERMISSION;
		}

		if (nfcAdapter.isEnabled()) {
			return DeviceStatus.DEVICE_STATUS_NFC_ENABLED;
		}
		return DeviceStatus.DEVICE_STATUS_NFC_DISABLED;
	}
}
