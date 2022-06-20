package no.entur.abt.android.token.exception;

import no.entur.abt.exchange.pb.common.DeviceAttestationErrorCode;

public class DeviceAttestationRemoteException extends Exception {

	private final DeviceAttestationErrorCode code;

	public DeviceAttestationErrorCode getCode() {
		return code;
	}

	public DeviceAttestationRemoteException(DeviceAttestationErrorCode code) {
		super();
		this.code = code;
	}

	public DeviceAttestationRemoteException(DeviceAttestationErrorCode code, String message) {
		super(message);
		this.code = code;
	}

	public DeviceAttestationRemoteException(DeviceAttestationErrorCode code, Throwable t) {
		super(t);
		this.code = code;
	}

	public DeviceAttestationRemoteException(DeviceAttestationErrorCode code, String message, Throwable t) {
		super(message, t);

		this.code = code;
	}
}
