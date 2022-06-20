package no.entur.abt.android.token.exception;

public class UnableToRenewTokenException extends TokenTemporarilyUnavailableException {

	public UnableToRenewTokenException() {
		super();
	}

	public UnableToRenewTokenException(String message) {
		super(message);
	}

	public UnableToRenewTokenException(Throwable t) {
		super(t);
	}

	public UnableToRenewTokenException(String message, Throwable t) {
		super(message, t);
	}
}
