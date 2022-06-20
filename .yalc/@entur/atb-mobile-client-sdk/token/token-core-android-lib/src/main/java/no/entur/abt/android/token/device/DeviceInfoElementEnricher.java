package no.entur.abt.android.token.device;

import java.util.List;

import uk.org.netex.www.netex.DeviceInfoElement;

public interface DeviceInfoElementEnricher {

	void enrich(List<DeviceInfoElement> list);

}
