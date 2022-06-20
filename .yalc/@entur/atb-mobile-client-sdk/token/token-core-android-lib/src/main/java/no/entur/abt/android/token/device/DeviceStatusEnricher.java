package no.entur.abt.android.token.device;

import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

public interface DeviceStatusEnricher {

	void enrich(List<DeviceStatus> list);

}
