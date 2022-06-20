package no.entur.abt.android.token.device;

import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

public class AttestationDeviceStatusEnricher implements DeviceStatusEnricher {

	private final AttestationStatusProvider attestationStatusProvider;

	public AttestationDeviceStatusEnricher(AttestationStatusProvider attestationStatusProvider) {
		this.attestationStatusProvider = attestationStatusProvider;
	}

	@Override
	public void enrich(List<DeviceStatus> list) {
		list.add(getAttestationStatus());
	}

	private DeviceStatus getAttestationStatus() {
		Boolean attestationFailure = attestationStatusProvider.getAttestationFailure();
		if (attestationFailure == null) {
			return DeviceStatus.DEVICE_STATUS_ATTESTATION_NO_DATA;
		}
		if (attestationFailure == Boolean.TRUE) {
			return DeviceStatus.DEVICE_STATUS_ATTESTATION_FAILED;
		}
		return DeviceStatus.DEVICE_STATUS_ATTESTATION_OK;
	}
}
