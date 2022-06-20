package no.entur.abt.android.token.device;

import static androidx.core.content.PermissionChecker.PERMISSION_GRANTED;

import android.Manifest;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;

import androidx.core.content.ContextCompat;

import java.util.List;

import no.entur.abt.core.exchange.pb.v1.DeviceStatus;

public class NetworkDeviceStatusEnricher extends AbstractDeviceStatusEnricher {

	public NetworkDeviceStatusEnricher(Context context) {
		super(context);
	}

	private DeviceStatus getNetworkStatus() {

		if (ContextCompat.checkSelfPermission(context, Manifest.permission.INTERNET) != PERMISSION_GRANTED) {
			return DeviceStatus.DEVICE_STATUS_NETWORK_NO_PERMISSION;
		}

		try {
			ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
			if (cm != null) {
				NetworkCapabilities capabilities = cm.getNetworkCapabilities(cm.getActiveNetwork());
				if (capabilities != null) {
					if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
							|| capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN) || capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
							||

							// https://www.makeuseof.com/tag/tethering-use-mobile-internet-pc/
							capabilities.hasTransport(NetworkCapabilities.TRANSPORT_BLUETOOTH)
							|| capabilities.hasTransport(NetworkCapabilities.TRANSPORT_USB)) {
						// ignore NetworkCapabilities.TRANSPORT_LOWPAN: for IOT
						// https://en.wikipedia.org/wiki/6LoWPAN

						return DeviceStatus.DEVICE_STATUS_NETWORK_CONNECTED;
					}
				}
			}
		} catch (Throwable e) {
			// ignore
		}

		return DeviceStatus.DEVICE_STATUS_NETWORK_DISCONNECTED;
	}

	@Override
	public void enrich(List<DeviceStatus> list) {
		list.add(getNetworkStatus());
	}
}
