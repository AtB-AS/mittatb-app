package no.entur.abt.android.test;

import android.content.Context;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.IdlingRegistry;

import org.junit.After;
import org.junit.Before;

public class AbstractConnectedTest {

	protected ConnectivityIdlingResource connectedIdlingResource;
	protected Context applicationContext;

	@Before
	public void before() throws Exception {

		applicationContext = ApplicationProvider.getApplicationContext();

		IdlingRegistry instance = IdlingRegistry.getInstance();
		connectedIdlingResource = new ConnectivityIdlingResource("resourceName", applicationContext, ConnectivityIdlingResource.WAIT_FOR_CONNECTION);
		instance.register(connectedIdlingResource);
	}

	@After
	public void unregisterIdlingResource() {
		if (connectedIdlingResource != null) {
			IdlingRegistry.getInstance().unregister(connectedIdlingResource);
		}
	}
}
