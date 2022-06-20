package no.entur.abt.android.token.device;

public interface AttestationStatusProvider {

	Boolean getAttestationFailure();

	void setStatus(Boolean status);

}
