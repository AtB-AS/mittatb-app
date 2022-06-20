package no.entur.abt.android.token.device;

public class DefaultAttestationStatusProvider implements AttestationStatusProvider {

	protected Boolean status;

	public DefaultAttestationStatusProvider() {
	}

	public DefaultAttestationStatusProvider(Boolean status) {
		this.status = status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	@Override
	public Boolean getAttestationFailure() {
		return status;
	}
}
