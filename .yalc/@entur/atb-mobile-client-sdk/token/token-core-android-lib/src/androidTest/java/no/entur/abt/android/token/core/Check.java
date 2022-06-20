package no.entur.abt.android.token.core;

public class Check {

	private String name;
	private Object value;
	private boolean pass;

	// exception message
	private ExceptionWrapper exception;

	public Check(String name, Object value) {
		this(name, value, true, null);
	}

	public Check(String name, Object value, boolean pass, Exception exception) {
		this.name = name;
		this.value = value;
		this.pass = pass;

		if (exception != null) {
			this.exception = new ExceptionWrapper(exception);
		}
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public boolean isPass() {
		return pass;
	}

	public void setPass(boolean pass) {
		this.pass = pass;
	}

	public ExceptionWrapper getException() {
		return exception;
	}

	public void setException(ExceptionWrapper exception) {
		this.exception = exception;
	}
}
