package no.entur.abt.android.time;

import android.app.Application;
import android.util.Log;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;

import io.tempo.AutoSyncConfig;
import io.tempo.Scheduler;
import io.tempo.Tempo;
import io.tempo.TimeSource;
import io.tempo.TimeSourceConfig;
import io.tempo.schedulers.NoOpScheduler;
import io.tempo.schedulers.WorkManagerScheduler;
import io.tempo.timeSources.SlackSntpTimeSource;

public class TempoRealtimeClock extends RealtimeClock {

	public static final String TAG = TempoRealtimeClock.class.getName();
	private final ZoneId zoneId;

	private boolean enabled;

	protected TempoRealtimeClock(boolean started) {
		this(started, ZoneOffset.UTC);
	}

	protected TempoRealtimeClock(boolean started, ZoneId zoneId) {
		this.enabled = started;
		this.zoneId = zoneId;
	}

	public static TempoRealtimeClockBuilder newBuilder(Application application) {
		return new TempoRealtimeClockBuilder(application);
	}

	@Override
	public ZoneId getZone() {
		return zoneId;
	}

	@Override
	public Clock withZone(ZoneId zone) {
		return new TempoRealtimeClock(enabled, zone);
	}

	@Override
	public Instant instant() {
		if (isInitialized() && enabled) {
			Long now = Tempo.nowOrNull();
			if (now != null) {
				return Instant.ofEpochMilli(now);
			}
		}
		return Instant.ofEpochMilli(System.currentTimeMillis());
	}

	public static class TempoRealtimeClockBuilder {

		// see https://github.com/AllanHasegawa/Tempo/blob/master/tempo/src/main/java/io/tempo/Tempo.kt
		private Application application;
		private List<TimeSource> timeSources;
		private io.tempo.Scheduler scheduler;
		private boolean autostart = true;

		public TempoRealtimeClockBuilder(Application application) {
			this.application = application;
		}

		public TempoRealtimeClockBuilder withAutostart(boolean autostart) {
			this.autostart = autostart;
			return this;
		}

		public TempoRealtimeClockBuilder withSlackSntpTimeSource() {
			// https://github.com/AllanHasegawa/Tempo/blob/master/tempo/src/main/java/io/tempo/timeSources/SlackSntpTimeSource.kt
			TimeSourceConfig config = new TimeSourceConfig("default-slack-sntp", 10);

			return withSlackSntpTimeSource(config, "time.google.com", 1000, 10000);
		}

		public TempoRealtimeClockBuilder withSlackSntpTimeSource(TimeSourceConfig config, String ntpPool, int maxRoundTripMs, int timeoutMs) {
			SlackSntpTimeSource source = new SlackSntpTimeSource(config, ntpPool, maxRoundTripMs, timeoutMs);

			return withTimeSources(source);
		}

		public TempoRealtimeClockBuilder withTimeSources(TimeSource... timeSources) {
			this.timeSources = Arrays.asList(timeSources);
			return this;
		}

		public TempoRealtimeClockBuilder withScheduler(Scheduler scheduler) {
			this.scheduler = scheduler;
			return this;
		}

		public TempoRealtimeClockBuilder withAndroidWorkManagerSchedulerMinutes(long minutes) {
			return withScheduler(new WorkManagerScheduler("tempo-workmanager", minutes));
		}

		public TempoRealtimeClock build() {
			if (scheduler == null) {
				scheduler = NoOpScheduler.INSTANCE;
			}
			AutoSyncConfig config = new AutoSyncConfig.ConstantInterval();
			Tempo.initialize(application, timeSources, config, scheduler, autostart);

			Tempo.addEventsListener(event -> Log.d(TAG, event.toString()));

			return new TempoRealtimeClock(autostart);
		}
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		if (!this.enabled && enabled) {
			Log.i(TAG, "Enable tempo");
			try {
				Tempo.start();
			} catch (IllegalArgumentException | IllegalStateException e) {
				Log.d(TAG, "Unexpected state when starting tempo", e);

				// XXX try catch continue
			}
		} else if (this.enabled && !enabled) {
			Log.i(TAG, "Disable tempo");
			try {
				Tempo.stop();
			} catch (IllegalArgumentException | IllegalStateException e) {
				Log.d(TAG, "Unexpected state when stopping tempo", e);

				// XXX try catch continue
			}
		} else if (enabled) {
			Log.d(TAG, "Tempo already enabled");
		} else {
			Log.d(TAG, "Tempo already disabled");
		}
		this.enabled = enabled;
	}

	@Override
	public boolean isInitialized() {
		return Tempo.isInitialized();
	}

}
