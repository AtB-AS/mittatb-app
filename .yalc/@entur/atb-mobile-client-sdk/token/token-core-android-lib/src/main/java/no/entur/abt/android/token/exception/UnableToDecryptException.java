package no.entur.abt.android.token.exception;

public class UnableToDecryptException extends TokenException {

	public UnableToDecryptException() {
		super();
	}

	public UnableToDecryptException(String message) {
		super(message);
	}

	public UnableToDecryptException(Throwable t) {
		super(t);
	}

	public UnableToDecryptException(String message, Throwable t) {
		super(message, t);
	}
}
