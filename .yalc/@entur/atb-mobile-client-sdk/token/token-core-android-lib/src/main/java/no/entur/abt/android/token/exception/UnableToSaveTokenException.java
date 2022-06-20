package no.entur.abt.android.token.exception;

public class UnableToSaveTokenException extends TokenStateException {

	public UnableToSaveTokenException() {
		super();
	}

	public UnableToSaveTokenException(String message) {
		super(message);
	}

	public UnableToSaveTokenException(Throwable t) {
		super(t);
	}

	public UnableToSaveTokenException(String message, Throwable t) {
		super(message, t);
	}
}
