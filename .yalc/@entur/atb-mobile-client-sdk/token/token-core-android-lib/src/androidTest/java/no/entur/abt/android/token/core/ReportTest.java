package no.entur.abt.android.token.core;

import static androidx.test.platform.app.InstrumentationRegistry.getInstrumentation;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import java.security.KeyStore;
import java.time.Instant;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import no.entur.abt.android.test.AbstractConnectedTest;
import no.entur.abt.android.token.attestation.DeviceAttestorBuilder;
import no.entur.abt.android.token.attestation.SafetyNetDeviceAttestator;
import no.entur.abt.android.token.core.keystore.AndroidKeystoreChecklistEnricher;
import no.entur.abt.android.token.core.safetynet.SafetyNetDeviceAttestatorChecklistEnricher;
import no.entur.abt.android.token.device.DefaultAttestationStatusProvider;
import no.entur.abt.android.token.device.DefaultDeviceDetailsProvider;
import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.android.token.device.OsDeviceInfoElementEnricher;
import no.entur.abt.android.token.keystore.DefaultTokenKeyStore;

@RunWith(AndroidJUnit4.class) // Base64 does work without
public class ReportTest extends AbstractConnectedTest {

	private static final String LOG_TAG = ReportTest.class.getName();

	private DefaultAttestationStatusProvider attestationStatusProvider = new DefaultAttestationStatusProvider(false);

	private KeyStore androidKeyStore;
	private DefaultTokenKeyStore<Object> tokenKeyStore;

	private AndroidKeystoreChecklistEnricher androidKeystoreChecklistEnricher;
	private SafetyNetDeviceAttestatorChecklistEnricher safetyNetDeviceAttestatorChecklistEnricher;

	private KeyAttestationWhitelistEntry entry;

	@Before
	public void before() throws Exception {
		super.before();

		androidKeyStore = KeyStore.getInstance("AndroidKeyStore");
		androidKeyStore.load(null);

		tokenKeyStore = DefaultTokenKeyStore.newBuilder().withKeyStore(androidKeyStore).build();

		androidKeystoreChecklistEnricher = new AndroidKeystoreChecklistEnricher(tokenKeyStore, getInstrumentation().getContext());

		DeviceDetailsProvider deviceDetailsProvider = DefaultDeviceDetailsProvider.newBuilder(applicationContext)
				.withApplicationDeviceInfoElement("a", "b", "c")
				.withOsDeviceInfoElement()

				.withNetworkDeviceStatus()
				.withBluetoohDeviceStatus()
				.withNfcDeviceStatus()
				.withDeviceAttestationDeviceStatus(attestationStatusProvider)

				.build();

		OsDeviceInfoElementEnricher elementEnricher = new OsDeviceInfoElementEnricher(applicationContext);
		entry = new KeyAttestationWhitelistEntry();
		entry.setModel_id(elementEnricher.getModel());
		entry.setManufacturer(elementEnricher.getManufacturer());
		String initialOsApiLevel = elementEnricher.getInitialOsApiLevel();
		if (initialOsApiLevel != null) {
			entry.setMax_initial_os_api_level(Integer.parseInt(initialOsApiLevel));
		} else {
			entry.setMax_initial_os_api_level(android.os.Build.VERSION.SDK_INT);
		}

		SafetyNetDeviceAttestator deviceAttestator = (SafetyNetDeviceAttestator) DeviceAttestorBuilder.newBuilder()
				.withContext(applicationContext)
				.withApiKey(applicationContext.getString(no.entur.abt.client.sdk.token.core.test.R.string.api_key))
				.withDeviceDetailsProvider(deviceDetailsProvider)
				.withEmulator(false)
				.withAttestationTimeout(10 * 1000)
				.build();

		safetyNetDeviceAttestatorChecklistEnricher = new SafetyNetDeviceAttestatorChecklistEnricher(deviceAttestator);
	}

	@Test
	public void testSafetyNet() throws Exception {
		Checklist report = new Checklist();

		safetyNetDeviceAttestatorChecklistEnricher.enrich(report);

		String result = toString(report, "safetynet");
		Log.d(LOG_TAG, "Report:\n" + result);

		Log.d(LOG_TAG, report.toString());

	}

	@Test
	public void testKeystore() throws Exception {
		Checklist report = new Checklist();

		androidKeystoreChecklistEnricher.enrich(entry, report, Instant.now());

		String result = toString(report, "keystore");
		Log.d(LOG_TAG, "Report:\n" + result);

		Log.d(LOG_TAG, report.toString());

		/*
		 * if (report.hasFailed()) { fail(); }
		 */
	}

	private String toString(Checklist checklist, String title) {
		StringBuilder last = new StringBuilder();

		int length = 100;

		int before = (length - title.length() - 2) / 2;
		String header = getStars(before);
		last.append(header + " " + title + " " + header + (title.length() % 2 == 1 ? "*" : ""));
		last.append("\n");

		if (checklist.hasFailed()) {
			StringBuilder fails = new StringBuilder();
			fails.append("*");
			fails.append(" ");
			for (int i = 0; fails.length() < length; i++) {
				fails.append("FAILED");
				fails.append(" ");
			}
			fails.setLength(length - 2);
			fails.append(" *");
			last.append(fails.toString());
			last.append("\n");
			last.append(getStars(length));
			last.append("\n");
		}

		List<Check> list = checklist.getList();
		for (Check ic : list) {
			toString(length, ic, last);
		}
		last.append(getStars(length));
		last.append("\n");

		return last.toString();
	}

	@NonNull
	private String getStars(int length) {
		StringBuilder last = new StringBuilder();
		for (int i = 0; i < length; i++) {
			last.append("*");
		}
		return last.toString();
	}

	@NonNull
	private void toString(int length, Check check, StringBuilder last) {
		last.append("* ");
		String name = check.getName();
		last.append(name);
		int spaces = length - 3 - name.length();

		String indicator = "failure";

		boolean pass = check.isPass();
		if (!pass) {
			spaces -= indicator.length() + 1;
		}

		for (int i = 0; i < spaces; i++) {
			last.append(" ");
		}
		if (!pass) {
			last.append(indicator);
			last.append(" ");
		}
		last.append("*");
		last.append("\n");
	}

	@After
	public void printWhiteliste() {
		Log.d(KeyAttestationWhitelistEntry.class.getName(), entry.toString());
	}

}
