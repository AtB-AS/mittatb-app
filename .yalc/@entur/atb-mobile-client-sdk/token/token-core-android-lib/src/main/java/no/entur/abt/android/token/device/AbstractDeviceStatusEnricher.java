package no.entur.abt.android.token.device;

import android.content.Context;

public abstract class AbstractDeviceStatusEnricher implements DeviceStatusEnricher {

	protected final Context context;

	public AbstractDeviceStatusEnricher(Context context) {
		this.context = context;
	}

}
