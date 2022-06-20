package no.entur.abt.android.test;

import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.runner.notification.RunNotifier;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.junit.runners.model.InitializationError;

public class ScreenRecordJUnit4ClassRunner extends BlockJUnit4ClassRunner {

	public ScreenRecordJUnit4ClassRunner(Class<?> klass) throws InitializationError {
		super(klass);
	}

	@Override
	public void run(RunNotifier notifier) {
		ScreenRecordInstrumentationRunListener listener = new ScreenRecordInstrumentationRunListener();
		listener.setInstrumentation(InstrumentationRegistry.getInstrumentation());

		notifier.addListener(listener);
		notifier.fireTestRunStarted(getDescription());
		super.run(notifier);
	}

}
