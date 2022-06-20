package no.entur.abt.android.token.exception;

public class UnableToCreateTokenException extends TokenTemporarilyUnavailableException {

	public UnableToCreateTokenException() {
		super();
	}

	public UnableToCreateTokenException(String message) {
		super(message);
	}

	public UnableToCreateTokenException(Throwable t) {
		super(t);
	}

	public UnableToCreateTokenException(String message, Throwable t) {
		super(message, t);
	}
}
