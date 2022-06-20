package no.entur.abt.android.token.core;

import com.google.gson.Gson;

public class KeyAttestationWhitelistEntry {

	public static final String KEY_ATTESTATION_LEVEL_HARDWARE = "KEY_ATTESTATION_LEVEL_HARDWARE";
	public static final String KEY_ATTESTATION_LEVEL_SOFTWARE = "KEY_ATTESTATION_LEVEL_SOFTWARE";
	public static final String KEY_ATTESTATION_LEVEL_NONE = "KEY_ATTESTATION_LEVEL_NONE";

	private String id;
	private String manufacturer;
	private String model_id;
	private Integer max_initial_os_api_level;
	private String required_key_attestation_level;
	/** validity as in time */
	private Boolean verify_certificate_validity;

	public String toString() {
		return new Gson().toJson(this);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public String getModel_id() {
		return model_id;
	}

	public void setModel_id(String model_id) {
		this.model_id = model_id;
	}

	public Integer getMax_initial_os_api_level() {
		return max_initial_os_api_level;
	}

	public void setMax_initial_os_api_level(Integer max_initial_os_api_level) {
		this.max_initial_os_api_level = max_initial_os_api_level;
	}

	public String getRequired_key_attestation_level() {
		return required_key_attestation_level;
	}

	public void setRequired_key_attestation_level(String required_key_attestation_level) {
		this.required_key_attestation_level = required_key_attestation_level;
	}

	public Boolean isVerify_certificate_validity() {
		return verify_certificate_validity;
	}

	public void setVerify_certificate_validity(Boolean verify_certificate_validity) {
		this.verify_certificate_validity = verify_certificate_validity;
	}
}
