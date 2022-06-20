package no.entur.abt.android.token.device;

import java.util.List;

import uk.org.netex.www.netex.DeviceInfoElement;
import uk.org.netex.www.netex.DeviceInfoType;

public class ApplicationDeviceInfoElementSource implements DeviceInfoElementEnricher {

	private final String applicationId;
	private final String applicationVersion;
	private final String libraryVersion;

	public ApplicationDeviceInfoElementSource(String applicationId, String applicationVersion, String libraryVersion) {
		this.applicationId = applicationId;
		this.applicationVersion = applicationVersion;
		this.libraryVersion = libraryVersion;
	}

	@Override
	public void enrich(List<DeviceInfoElement> applicationData) {
		// app
		applicationData.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_LIBRARY_VERSION).setValue(libraryVersion).build());
		applicationData.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_APPLICATION_ID).setValue(applicationId).build());
		applicationData.add(DeviceInfoElement.newBuilder().setType(DeviceInfoType.DEVICE_INFO_TYPE_APPLICATION_VERSION).setValue(applicationVersion).build());
	}

	public String getLibraryVersion() {
		return libraryVersion;
	}

	public String getApplicationVersion() {
		return applicationVersion;
	}

	public String getApplicationId() {
		return applicationId;
	}
}
