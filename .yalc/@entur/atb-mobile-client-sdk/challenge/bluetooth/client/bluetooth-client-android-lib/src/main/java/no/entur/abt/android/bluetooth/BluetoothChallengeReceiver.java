package no.entur.abt.android.bluetooth;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import no.entur.abt.android.bluetooth.format.Challenge;
import no.entur.abt.android.bluetooth.format.ChallengeFilter;
import no.entur.abt.android.bluetooth.format.ChallengeListener;
import no.entur.abt.android.bluetooth.format.ChallengeReceiver;
import no.entur.abt.android.bluetooth.format.ChallengeVerifier;
import no.entur.abt.android.bluetooth.format.SignedChallenge;

// https://www.argenox.com/library/bluetooth-low-energy/ble-advertising-primer/

public class BluetoothChallengeReceiver implements ChallengeReceiver {
	// Algorithm used to sign the challenge

	// ManufacturerID for our Bluetooth Advertising frames
	public static final int BLUETOOTH_MANUFACTURER_ID = 0xF0A2;

	private static final String LOG_TAG = BluetoothChallengeReceiver.class.getName();

	private static final ChallengeAdvertisingFrameBinaryFormat FORMAT = new ChallengeAdvertisingFrameBinaryFormat();

	private final ChallengeVerifier challengeVerifier;
	private BluetoothAdapter adapter;

	private Context context;
	private BluetoothLeScanner scanner;

	private Map<Integer, ChallengeStatistics<SignedChallenge>> statisticsPerClient = new ConcurrentHashMap<>();

	private ChallengeAdvertisingFrameAssembler challengeAvertisingFrameAssembler;
	private ChallengeAdvertisingFrameFilter challengeAdvertisingFrameFilter = new ChallengeAdvertisingFrameFilter();

	private Set<ChallengeListener> challengeListeners = Collections.synchronizedSet(new HashSet<>());
	private Set<Challenge> recievedChallenges = Collections.synchronizedSet(new HashSet<>());

	private boolean scanning = false;

	private Clock clock;
	private ChallengeFilter challengeFilter;

	private final BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			final String action = intent.getAction();

			if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
				final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
				switch (state) {
				case BluetoothAdapter.STATE_TURNING_OFF:
					challengeListeners.stream().forEach(ChallengeListener::onBluetoothDisasbled);
					break;
				default:
					// Ignored
				}

			}
		}
	};

	private ScanCallback callback = new ScanCallback() {
		@Override
		public void onScanResult(int callbackType, ScanResult result) {
			// TODO bruk (remote) device id til å filtrere / samle sammen meldinger
			ScanRecord scanRecord = result.getScanRecord();
			if (scanRecord != null) {
				// check signatureVerifier, extract lastFrame
				byte[] serviceData = scanRecord.getManufacturerSpecificData(BLUETOOTH_MANUFACTURER_ID);
				if (serviceData != null) {
					frameReceived(result, serviceData);
				}
			}
		}

		@Override
		public void onScanFailed(int errorCode) {
			Log.e(LOG_TAG, "Could not start scanning, errorCode=" + errorCode);
			super.onScanFailed(errorCode);
			for (ChallengeListener challengeListener : challengeListeners) {
				challengeListener.onScanFailed(errorCode);
			}
		}

		private void frameReceived(ScanResult result, byte[] data) {
			// TODO possibly create a simple filter here, so that we dont process the same data twice
			if (!challengeAdvertisingFrameFilter.hasFrame(data)) {
				ChallengeAdvertisingFrame frame = FORMAT.parseOrNull(data);
				if (frame != null) {
					byte[] newChallenge = challengeAvertisingFrameAssembler.addFrame(frame);
					if (newChallenge != null) {
						challengeReceived(newChallenge);
					}
					registerFrameReceived(result, frame);
				} else {
					Log.w(LOG_TAG, "Data received but frame could not be decoded.");
				}
			}
		}
	};

	public BluetoothChallengeReceiver(Context context, BluetoothAdapter adapter, Clock clock, ChallengeVerifier challengeVerifier,
			ChallengeListener... challengeListeners) {
		this.context = context;
		this.adapter = adapter;
		this.clock = clock;
		this.challengeFilter = new ChallengeFilter(clock);
		this.challengeAvertisingFrameAssembler = new ChallengeAdvertisingFrameAssembler();
		this.challengeVerifier = challengeVerifier;

		if (challengeListeners != null) {
			for (ChallengeListener challengeListener : challengeListeners) {
				this.challengeListeners.add(challengeListener);
			}
		}
	}

	@Override
	public void onResume() {
		Log.d(LOG_TAG, "onResume");
		// Register for Bluetooth state changes

		startScanning();
	}

	@Override
	public void onPause() {
		Log.d(LOG_TAG, "onPause");
		stopScanning();
	}

	@SuppressLint("MissingPermission")
	private void stopScanning() {
		if (scanning) {
			Log.d(LOG_TAG, "Stopping scanning");
			context.unregisterReceiver(broadcastReceiver);

			scanning = false;
			if (adapter.isEnabled()) {
				scanner.stopScan(callback);
			}

			// reset nonce / challenge memory
			challengeAvertisingFrameAssembler.clear();
			recievedChallenges.clear();
			challengeFilter.clear();
			challengeAdvertisingFrameFilter.clear();
		} else {
			Log.d(LOG_TAG, "Scanning already stopped");
		}
	}

	private void challengeReceived(byte[] newChallenge) {
		Log.d(LOG_TAG, "Found new challenge");
		// verify signature first
		// then process contents
		Challenge verified = challengeVerifier.verify(newChallenge);
		if (verified != null) {
			// filter actual challenge itself
			// so we don't care about the same challenge signed
			// with difference keys here, or if it was on another logical
			// channel
			if (!recievedChallenges.contains(verified)) {
				recievedChallenges.add(verified);

				SignedChallenge signedChallenge = new SignedChallenge(newChallenge, verified);
				registerChallengeReceived(signedChallenge);
				Set<SignedChallenge> scope = challengeFilter.add(signedChallenge);
				for (ChallengeListener challengeListener : challengeListeners) {
					challengeListener.onChallengeReceived(scope);
				}

			}
		} else {
			Log.d(LOG_TAG, "Unable to verify challenge signatures");
		}
	}

	private void registerFrameReceived(ScanResult result, ChallengeAdvertisingFrame frame) {
		int clientId = frame == null ? null : frame.getHeader().getClientId();
		ChallengeStatistics<SignedChallenge> clientStatistics = statisticsPerClient.computeIfAbsent(clientId, c -> new ChallengeStatistics(clientId, clock));
		clientStatistics.registerFrameReceived(frame, result.getRssi());
	}

	private void registerChallengeReceived(SignedChallenge challenge) {
		Integer clientId = challenge.getChallenge().getClientId();

		ChallengeStatistics<SignedChallenge> clientStatistics = statisticsPerClient.computeIfAbsent(clientId, c -> new ChallengeStatistics(clientId, clock));
		clientStatistics.registerNonceReceived(challenge);
	}

	@SuppressLint("MissingPermission")
	public void startScanning() {
		this.scanner = adapter.getBluetoothLeScanner();

		if (scanner != null) {
			if (!scanning) {
				Log.d(LOG_TAG, "Start scanning");

				IntentFilter filter = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
				context.registerReceiver(broadcastReceiver, filter);

				scanning = true;

				List<ScanFilter> scanFilters = new ArrayList<>();
				ScanFilter.Builder builder = new ScanFilter.Builder().setManufacturerData(BLUETOOTH_MANUFACTURER_ID, new byte[0], new byte[0]);
				scanFilters.add(builder.build());

				ScanSettings scanSettings = (new ScanSettings.Builder()).setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
						.setCallbackType(ScanSettings.CALLBACK_TYPE_ALL_MATCHES)
						.setMatchMode(ScanSettings.MATCH_MODE_AGGRESSIVE)
						.setNumOfMatches(ScanSettings.MATCH_NUM_MAX_ADVERTISEMENT)
						.build();
				scanner.startScan(scanFilters, scanSettings, callback);
			} else {
				Log.d(LOG_TAG, "Already started scanning");
			}
		}
	}

	public List<ChallengeStatistics<SignedChallenge>> getChallengeStatistics() {
		return new ArrayList<>(statisticsPerClient.values());
	}

	@Override
	public void addChallengeListener(ChallengeListener challengeListener) {
		challengeListeners.add(challengeListener);
	}

	@Override
	public void removeChallengeListener(ChallengeListener challengeListener) {
		challengeListeners.remove(challengeListener);
	}

}
