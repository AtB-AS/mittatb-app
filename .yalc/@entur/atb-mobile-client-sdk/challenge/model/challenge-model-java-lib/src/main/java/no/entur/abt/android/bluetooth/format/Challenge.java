package no.entur.abt.android.bluetooth.format;

import java.io.Serializable;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoField;
import java.util.Arrays;
import java.util.Objects;

/**
 * A challenge broadcast from an inspection client to devices that should be expected. <br>
 * <br>
 * Includes a nonce (secret), necessary parameters to decide if, and how, client should initiate self inspection and meta information for distinguishing this
 * challenge from others broadcast from this or other inspectors in the vicinity. <br>
 * <br>
 * Subsequent versions of the challenge would typically subclass this instance, then typically discriminate between new and old formats based on class name or
 * the version identifier (not implemented here).
 *
 */
public class Challenge implements Serializable {

	public static final int TRANSPORT_ANY = 0;
	public static final int TRANSPORT_BLUETOOTH_BROADCAST = 1;
	public static final int TRANSPORT_NFC = 2;

	public static Challenge.Builder newBuilder() {
		return new Builder();
	}

	public static class Builder {
		private Integer clientId;
		private Duration delay;
		private Boolean selfInspect;
		private byte[] nonce;
		private Instant validToTime;
		private Integer transport;

		public Builder withTransport(int transport) {
			this.transport = transport;
			return this;
		}

		public Builder withClientId(int clientId) {
			this.clientId = clientId;
			return this;
		}

		public Builder withDelay(Duration delay) {
			this.delay = delay;
			return this;
		}

		public Builder withSelfInspect(boolean selfInspect) {
			this.selfInspect = selfInspect;
			return this;
		}

		public Builder withNonce(byte[] nonce) {
			this.nonce = nonce;
			return this;
		}

		public Builder withValidToTime(Instant validToTime) { // exclusive
			this.validToTime = validToTime;
			return this;
		}

		public Challenge build() {
			if (clientId == null) {
				throw new IllegalStateException();
			}
			if (clientId < 0) {
				throw new IllegalArgumentException("Expected positive client id, found " + clientId);
			}
			if (delay == null) {
				throw new IllegalStateException();
			}
			if (selfInspect == null) {
				throw new IllegalStateException();
			}
			if (nonce == null) {
				throw new IllegalStateException();
			}
			if (validToTime == null) {
				throw new IllegalStateException();
			}
			if (transport == null) {
				throw new IllegalStateException();
			}
			long minutes = delay.toMinutes();
			if (validToTime.get(ChronoField.MILLI_OF_SECOND) > 0) {
				throw new IllegalStateException();
			}
			return new Challenge(clientId, Duration.ofMinutes(minutes), selfInspect, nonce, validToTime, transport);
		}

	}

	private final int clientId;
	private final Duration delay;
	private final boolean selfInspect;
	private final byte[] nonce;
	private final Instant validToTime;
	private final int transport;

	protected Challenge(int clientId, Duration delay, boolean selfInspect, byte[] nonce, Instant validToTime, int transport) {
		this.clientId = clientId;
		this.delay = Duration.ofMinutes(delay.toMinutes());
		this.selfInspect = selfInspect;
		this.nonce = nonce;
		this.validToTime = validToTime;
		this.transport = transport;
	}

	public String toString() {
		return getClass().getName() + "[" + toHexString(nonce) + " clientId " + clientId + " delay: " + delay + " self inspect: " + selfInspect + " valid to "
				+ validToTime + "]";
	}

	public int getClientId() {
		return clientId;
	}

	public byte[] getNonce() {
		return nonce;
	}

	private static String toHexString(byte[] data) {
		StringBuilder sb = new StringBuilder();
		if (data != null) {
			for (byte b : data) {
				sb.append(String.format("%02X", b));
			}
		}
		return sb.toString();
	}

	public boolean isSelfInspect() {
		return selfInspect;
	}

	public Instant getValidToTime() {
		return validToTime;
	}

	public Duration getDelay() {
		return delay;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Challenge challenge = (Challenge) o;
		return clientId == challenge.clientId && selfInspect == challenge.selfInspect && Objects.equals(delay, challenge.delay)
				&& Arrays.equals(nonce, challenge.nonce) && Objects.equals(validToTime, challenge.validToTime) && transport == challenge.transport;
	}

	@Override
	public int hashCode() {
		int result = Objects.hash(clientId, delay, selfInspect, validToTime, transport);
		result = 31 * result + Arrays.hashCode(nonce);
		return result;
	}

	public boolean isValid(Instant time) {
		return time.isBefore(validToTime);
	}

	public boolean intercepts(Instant start, Instant end) {
		return isValid(start) || isValid(end);
	}

	public boolean nonceEquals(byte[] candidate) {
		return Arrays.equals(nonce, candidate);
	}

	public int getTransport() {
		return transport;
	}
}
