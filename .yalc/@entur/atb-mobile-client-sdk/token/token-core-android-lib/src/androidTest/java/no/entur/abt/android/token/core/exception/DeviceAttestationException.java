package no.entur.abt.android.token.core.exception;

public abstract class DeviceAttestationException extends Exception {

	public DeviceAttestationException(String message) {
		super(message);
	}

	public DeviceAttestationException(String message, Throwable cause) {
		super(message, cause);
	}

}
