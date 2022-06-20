package no.entur.abt.android.token.exception;

public class NoTokenException extends TokenPermanentlyUnavailableException {

	public NoTokenException() {
		super();
	}

	public NoTokenException(String message) {
		super(message);
	}
}
