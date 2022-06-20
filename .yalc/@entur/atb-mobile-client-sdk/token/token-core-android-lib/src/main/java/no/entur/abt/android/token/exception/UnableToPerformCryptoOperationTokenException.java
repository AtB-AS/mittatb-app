package no.entur.abt.android.token.exception;

public class UnableToPerformCryptoOperationTokenException extends TokenTemporarilyUnavailableException {

	public UnableToPerformCryptoOperationTokenException() {
		super();
	}

	public UnableToPerformCryptoOperationTokenException(String message) {
		super(message);
	}

	public UnableToPerformCryptoOperationTokenException(Throwable t) {
		super(t);
	}

	public UnableToPerformCryptoOperationTokenException(String message, Throwable t) {
		super(message, t);
	}
}
