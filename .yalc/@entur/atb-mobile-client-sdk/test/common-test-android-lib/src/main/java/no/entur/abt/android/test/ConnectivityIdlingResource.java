package no.entur.abt.android.test;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import androidx.test.espresso.IdlingResource;

/**
 * 
 * As the device is starting, usually a lot of things is going on. Wait for network to be enabled before proceeding.
 * 
 */

// https://github.com/kushsaini10/connectivity-idling-resource/blob/master/src/main/java/com/kushsaini/espresso/ConnectivityIdlingResource.java
public final class ConnectivityIdlingResource implements IdlingResource {

	public static int WAIT_FOR_CONNECTION = 1;
	public static int WAIT_FOR_DISCONNECTION = 0;
	private static final String TAG = "ConnectIdlingResource";
	private final String resourceName;
	private final Context mContext;
	private final int mode;

	private volatile ResourceCallback resourceCallback;

	/**
	 *
	 * @param resourceName name of the resource (used for logging and idempotency of registration
	 * @param context      context
	 * @param mode         if mode is WAIT_FOR_CONNECTION i.e. value is 1 then the {@link IdlingResource} halts test until internet is available and if mode is
	 *                     WAIT_FOR_DISCONNECTION i.e. value is 0 then {@link IdlingResource} waits for internet to disconnect
	 */
	public ConnectivityIdlingResource(String resourceName, Context context, int mode) {
		this.resourceName = resourceName;
		this.mContext = context;
		this.mode = mode;
	}

	@Override
	public String getName() {
		return resourceName;
	}

	@Override
	public boolean isIdleNow() {
		ConnectivityManager cm = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
		if (cm == null) {
			Log.e(TAG, "Cannot access network information, assuming connected.");

			return true;
		}
		NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
		if (activeNetwork == null) {
			Log.e(TAG, "Cannot access network information, assuming connected.");

			return true;
		}
		boolean isConnected = activeNetwork.isConnected();

		boolean idle;
		if (mode == WAIT_FOR_DISCONNECTION && !isConnected) {
			idle = true;
		} else if (mode == WAIT_FOR_CONNECTION && isConnected) {
			idle = true;
		} else {
			idle = false;
		}

		if (!idle && resourceCallback != null) {
			resourceCallback.onTransitionToIdle();
		}

		return isConnected;
	}

	@Override
	public void registerIdleTransitionCallback(ResourceCallback resourceCallback) {
		this.resourceCallback = resourceCallback;
	}
}
