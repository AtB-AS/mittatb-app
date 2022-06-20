package no.entur.abt.android.token;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import no.entur.abt.android.test.ThreadHelper;

@RunWith(AndroidJUnit4.class) // Base64 does work without
public class DefaultTokenPropertyStoreTest {

	private ReentrantLock lock = new ReentrantLock();
	private DefaultTokenPropertyStore store;

	protected TokenContext tokenContext = mock(TokenContext.class);

	private Runnable lockRunnable = new Runnable() {
		@Override
		public void run() {
			if (!lock.tryLock()) {
				throw new RuntimeException();
			}
		}
	};

	private Runnable unlockRunnable = new Runnable() {
		@Override
		public void run() {
			lock.unlock();
		}
	};

	@Before
	public void before() throws Exception {
		when(tokenContext.getId()).thenReturn("entur");

		Context applicationContext = ApplicationProvider.getApplicationContext();
		SharedPreferences sharedPreferences = applicationContext.getSharedPreferences("prefs", Context.MODE_PRIVATE);

		store = new DefaultTokenPropertyStore(sharedPreferences, lock, 1000);
		store.clearAll();
	}

	@Test
	public void shouldSupportActiveToken() throws Exception {
		String id = "myId";
		Instant end = Instant.EPOCH;
		Instant start = Instant.now();
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.setToken(id, start, end);
			editor.commitOrThrowException();
		}

		assertThat(store.getTokenId(tokenContext)).isEqualTo(id);
		assertThat(store.getTokenValidityStart(tokenContext)).isEqualTo(start);
		assertThat(store.getTokenValidityEnd(tokenContext)).isEqualTo(end);

		// all other must be null
		assertNull(store.getPendingNewTokenId(tokenContext));
		assertNull(store.getPendingNewTokenCommandUuid(tokenContext));
		assertNull(store.getPendingNewTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingNewTokenCommandTrace(tokenContext));

		assertNull(store.getPendingRenewalTokenId(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandUuid(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestationType(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandTrace(tokenContext));

		// remove and check that now is empty
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.removeToken();
			editor.commitOrThrowException();
		}

		assertThat(store.getTokenId(tokenContext)).isNull();
		assertThat(store.getTokenValidityStart(tokenContext)).isNull();
		assertThat(store.getTokenValidityEnd(tokenContext)).isNull();
	}

	@Test
	public void shouldSupportPendingNewToken() throws Exception {
		String id = "myId";
		byte[] attestation = new byte[] { 0, 0x01, 0x02 };
		String uuid = UUID.randomUUID().toString();
		byte[] trace = new byte[] { 0, 0x04, 0x08 };
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.setPendingNewToken(id, uuid, attestation, "TestType", trace);
			editor.commitOrThrowException();
		}

		assertThat(store.getPendingNewTokenId(tokenContext)).isEqualTo(id);
		assertThat(store.getPendingNewTokenCommandUuid(tokenContext)).isEqualTo(uuid);
		assertThat(store.getPendingNewTokenCommandAttestation(tokenContext)).isEqualTo(attestation);
		assertThat(store.getPendingNewTokenCommandAttestationType(tokenContext)).isEqualTo("TestType");
		assertThat(store.getPendingNewTokenCommandTrace(tokenContext)).isEqualTo(trace);

		// all other must be null
		assertThat(store.getTokenId(tokenContext)).isNull();
		assertThat(store.getTokenValidityStart(tokenContext)).isNull();
		assertThat(store.getTokenValidityEnd(tokenContext)).isNull();

		assertNull(store.getPendingRenewalTokenId(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandUuid(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestationType(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandTrace(tokenContext));

		// remove and check that now is empty
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.removePendingNewToken();
			editor.commitOrThrowException();
		}

		assertNull(store.getPendingNewTokenId(tokenContext));
		assertNull(store.getPendingNewTokenCommandUuid(tokenContext));
		assertNull(store.getPendingNewTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingNewTokenCommandTrace(tokenContext));
	}

	@Test
	public void shouldSupportPendingRenewalToken() throws Exception {
		String id = "myId";
		byte[] attestation = new byte[] { 0, 0x01, 0x02 };
		String uuid = UUID.randomUUID().toString();
		byte[] trace = new byte[] { 0, 0x04, 0x08 };
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.setPendingRenewalToken(id, uuid, attestation, "TestType", trace);
			editor.commitOrThrowException();
		}

		assertThat(store.getPendingRenewalTokenId(tokenContext)).isEqualTo(id);
		assertThat(store.getPendingRenewalTokenCommandUuid(tokenContext)).isEqualTo(uuid);
		assertThat(store.getPendingRenewalTokenCommandAttestation(tokenContext)).isEqualTo(attestation);
		assertThat(store.getPendingRenewalTokenCommandAttestationType(tokenContext)).isEqualTo("TestType");
		assertThat(store.getPendingRenewalTokenCommandTrace(tokenContext)).isEqualTo(trace);

		// all other must be null
		assertThat(store.getTokenId(tokenContext)).isNull();
		assertThat(store.getTokenValidityStart(tokenContext)).isNull();
		assertThat(store.getTokenValidityEnd(tokenContext)).isNull();

		assertNull(store.getPendingNewTokenId(tokenContext));
		assertNull(store.getPendingNewTokenCommandUuid(tokenContext));
		assertNull(store.getPendingNewTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingNewTokenCommandAttestationType(tokenContext));
		assertNull(store.getPendingNewTokenCommandTrace(tokenContext));

		// remove and check that now is empty
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.removePendingRenewalToken();
			editor.commitOrThrowException();
		}

		assertNull(store.getPendingRenewalTokenId(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandUuid(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestationType(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandTrace(tokenContext));
	}

	@Test
	public void shouldThrowExceptionIfAnotherThreadBlocksWriteForTooLong() throws Exception {
		ThreadHelper helper = new ThreadHelper().addRun(lockRunnable).addPause().addRun(unlockRunnable);
		try {
			helper.start();
			while (helper.getState() != Thread.State.WAITING) {
				Thread.yield();
			}

			assertThrows(TokenPropertyStoreException.class, () -> {
				store.getEditor(tokenContext);
			});
		} finally {
			helper.close();
		}
	}

	@Test
	public void testClearAll() throws Exception {
		String id = "myId0";
		Instant end = Instant.EPOCH;
		Instant start = Instant.now();
		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.setToken(id, start, end);
			editor.commitOrThrowException();
		}
		String renewalTokenId = "myId1";
		byte[] renewalTokenCommandAttestation = new byte[] { 0, 0x01, 0x02 };
		String renewalTokenCommandUuid = UUID.randomUUID().toString();
		byte[] renewalTokenCommandTrace = new byte[] { 0, 0x04, 0x08 };

		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.setPendingRenewalToken(renewalTokenId, renewalTokenCommandUuid, renewalTokenCommandAttestation, "TestType", renewalTokenCommandTrace);
			editor.commitOrThrowException();
		}

		String newTokenId = "myId2";
		byte[] newTokenCommandAttestation = new byte[] { 0, 0x01, 0x03 };
		String newTokenCommandUuid = UUID.randomUUID().toString();
		byte[] newTokenCommandTrace = new byte[] { 0, 0x04, 0x09 };

		try (TokenPropertyStore.Editor editor = store.getEditor(tokenContext)) {
			editor.setPendingNewToken(newTokenId, newTokenCommandUuid, newTokenCommandAttestation, "TestType", newTokenCommandTrace);
			editor.commitOrThrowException();
		}

		store.clearAll();

		assertThat(store.getTokenId(tokenContext)).isNull();
		assertThat(store.getTokenValidityStart(tokenContext)).isNull();
		assertThat(store.getTokenValidityEnd(tokenContext)).isNull();

		assertNull(store.getPendingNewTokenId(tokenContext));
		assertNull(store.getPendingNewTokenCommandUuid(tokenContext));
		assertNull(store.getPendingNewTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingNewTokenCommandTrace(tokenContext));

		assertNull(store.getPendingRenewalTokenId(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandUuid(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestation(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandAttestationType(tokenContext));
		assertNull(store.getPendingRenewalTokenCommandTrace(tokenContext));

	}
}
