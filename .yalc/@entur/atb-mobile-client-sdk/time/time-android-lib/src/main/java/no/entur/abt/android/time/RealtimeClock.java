package no.entur.abt.android.time;

import java.time.Clock;

/**
 * 
 * Interface for providing real time via NTP or GPS.
 * 
 * // TODO investigate need to 'initialized / ready / started' listener
 */

public abstract class RealtimeClock extends Clock {

	abstract public boolean isInitialized();

	abstract public void setEnabled(boolean enabled);

	abstract public boolean isEnabled();

	// TODO might also return time with a synchronized flag

}
