package no.entur.abt.android.token.device;

import android.content.Context;

import java.util.ArrayList;
import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceDetails;
import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

import uk.org.netex.www.netex.DeviceInfoElement;

public class DefaultDeviceDetailsProvider implements DeviceDetailsProvider {

	public static Builder newBuilder(Context context) {
		return new Builder(context);
	}

	public static class Builder {

		private final Context context;

		private List<DeviceInfoElementEnricher> deviceInfoElementEnrichers = new ArrayList<>();
		private List<DeviceStatusEnricher> deviceStatusEnrichers = new ArrayList<>();

		public Builder(Context context) {
			this.context = context;
		}

		public Builder withNfcDeviceStatus() {
			return withDeviceStatusEnricher(new NfcDeviceStatusEnricher(context));
		}

		public Builder withNetworkDeviceStatus() {
			return withDeviceStatusEnricher(new NetworkDeviceStatusEnricher(context));
		}

		public Builder withDeviceAttestationDeviceStatus(AttestationStatusProvider provider) {
			return withDeviceStatusEnricher(new AttestationDeviceStatusEnricher(provider));
		}

		public Builder withBluetoohDeviceStatus() {
			return withDeviceStatusEnricher(new BluetoothDeviceStatusEnricher(context));
		}

		public Builder withDeviceStatusEnricher(DeviceStatusEnricher enricher) {
			deviceStatusEnrichers.add(enricher);
			return this;
		}

		public Builder withApplicationDeviceInfoElement(String applicationId, String applicationVersion, String libraryVersion) {
			deviceInfoElementEnrichers.add(new ApplicationDeviceInfoElementSource(applicationId, applicationVersion, libraryVersion));
			return this;
		}

		public Builder withOsDeviceInfoElement() {
			deviceInfoElementEnrichers.add(new OsDeviceInfoElementEnricher(context));
			return this;
		}

		public Builder withDeviceInfoElementEnricher(DeviceInfoElementEnricher enricher) {
			deviceInfoElementEnrichers.add(enricher);
			return this;
		}

		public Builder withDeviceInfoElementEnrichers(List<DeviceInfoElementEnricher> deviceInfoElementEnrichers) {
			this.deviceInfoElementEnrichers = deviceInfoElementEnrichers;

			return this;
		}

		public Builder withDeviceStatusEnrichers(List<DeviceStatusEnricher> deviceStatusEnrichers) {
			this.deviceStatusEnrichers = deviceStatusEnrichers;

			return this;
		}

		public DeviceDetailsProvider build() {
			return new DefaultDeviceDetailsProvider(deviceInfoElementEnrichers, deviceStatusEnrichers);
		}
	}

	private final List<DeviceInfoElementEnricher> deviceInfoElementEnrichers;
	private final List<DeviceStatusEnricher> deviceStatusEnrichers;

	public DefaultDeviceDetailsProvider(List<DeviceInfoElementEnricher> deviceInfoElementEnrichers, List<DeviceStatusEnricher> deviceStatusEnrichers) {
		this.deviceInfoElementEnrichers = deviceInfoElementEnrichers;
		this.deviceStatusEnrichers = deviceStatusEnrichers;
	}

	@Override
	public DeviceDetails getDeviceDetails() {
		return DeviceDetails.newBuilder().addAllDeviceInfo(getDeviceInfo()).addAllDeviceStatuses(getDeviceStatuses()).build();
	}

	@Override
	public List<DeviceInfoElement> getDeviceInfo() {
		List<DeviceInfoElement> applicationData = new ArrayList<>();

		for (DeviceInfoElementEnricher deviceInfoElementEnricher : deviceInfoElementEnrichers) {
			deviceInfoElementEnricher.enrich(applicationData);
		}

		return applicationData;
	}

	@Override
	public List<DeviceStatus> getDeviceStatuses() {
		List<DeviceStatus> deviceStatuses = new ArrayList<>();

		for (DeviceStatusEnricher deviceStatusEnricher : deviceStatusEnrichers) {
			deviceStatusEnricher.enrich(deviceStatuses);
		}

		return deviceStatuses;
	}

	@Override
	public <T extends DeviceInfoElementEnricher> T getDeviceInfo(Class<T> c) {
		for (DeviceInfoElementEnricher enricher : deviceInfoElementEnrichers) {
			if (c.isAssignableFrom(enricher.getClass())) {
				return (T) enricher;
			}
		}
		return null;
	}

	@Override
	public <T extends DeviceStatusEnricher> T getDeviceStatus(Class<T> c) {
		for (DeviceStatusEnricher enricher : deviceStatusEnrichers) {
			if (c.isAssignableFrom(enricher.getClass())) {
				return (T) enricher;
			}
		}
		return null;
	}

}
