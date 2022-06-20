package no.entur.abt.android.token.exception;

public class UnableToIncludeCertificateException extends TokenTemporarilyUnavailableException {

	public UnableToIncludeCertificateException() {
		super();
	}

	public UnableToIncludeCertificateException(String message) {
		super(message);
	}

	public UnableToIncludeCertificateException(Throwable t) {
		super(t);
	}

	public UnableToIncludeCertificateException(String message, Throwable t) {
		super(message, t);
	}
}
