package no.entur.abt.android.token.attestation;

import android.content.Context;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.safetynet.SafetyNet;
import com.google.android.gms.safetynet.SafetyNetClient;

import no.entur.abt.android.token.device.DeviceDetailsProvider;

public class DeviceAttestorBuilder {

	private Context context;
	private boolean emulator = false;
	private DeviceDetailsProvider deviceDetailsProvider;
	private String apiKey;
	private long attestationTimeout = -1L;

	public static DeviceAttestorBuilder newBuilder() {
		return new DeviceAttestorBuilder();
	}

	public DeviceAttestorBuilder withApiKey(String apiKey) {
		this.apiKey = apiKey;

		return this;
	}

	public DeviceAttestorBuilder withAttestationTimeout(int millis) {
		this.attestationTimeout = millis;

		return this;
	}

	public DeviceAttestorBuilder withContext(Context context) {
		this.context = context;

		return this;
	}

	public DeviceAttestorBuilder withEmulator(boolean emulator) {
		this.emulator = emulator;

		return this;
	}

	public DeviceAttestorBuilder withDeviceDetailsProvider(DeviceDetailsProvider deviceDetailsProvider) {
		this.deviceDetailsProvider = deviceDetailsProvider;

		return this;
	}

	public DeviceAttestator build() {
		if (deviceDetailsProvider == null) {
			throw new IllegalStateException();
		}
		if (emulator) {
			return new EmulatorDeviceAttestor(deviceDetailsProvider);
		}
		if (context == null) {
			throw new IllegalStateException();
		}
		if (apiKey == null) {
			throw new IllegalStateException();
		}
		if (attestationTimeout == -1L) {
			throw new IllegalArgumentException();
		}
		if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context, 13000000) == ConnectionResult.SUCCESS) {
			SafetyNetClient client = SafetyNet.getClient(context);

			return new SafetyNetDeviceAttestator(client, apiKey, deviceDetailsProvider, attestationTimeout);
		} else {
			throw new IllegalStateException("Failed to get attestation because Google Play version >= 13 is not available");
		}

	}
}
