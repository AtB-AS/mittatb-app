package no.entur.abt.android.token.device;

import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceDetails;
import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

import uk.org.netex.www.netex.DeviceInfoElement;

public interface DeviceDetailsProvider {
	String UNKNOWN_VALUE = "(unknown)";

	DeviceDetails getDeviceDetails();

	List<DeviceInfoElement> getDeviceInfo();

	List<DeviceStatus> getDeviceStatuses();

	<T extends DeviceInfoElementEnricher> T getDeviceInfo(Class<T> c);

	<T extends DeviceStatusEnricher> T getDeviceStatus(Class<T> c);
}
