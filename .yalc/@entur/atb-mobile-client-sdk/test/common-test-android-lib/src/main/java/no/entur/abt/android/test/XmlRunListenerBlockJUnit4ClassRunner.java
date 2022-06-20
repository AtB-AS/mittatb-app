package no.entur.abt.android.test;

import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.runner.notification.RunNotifier;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.junit.runners.model.InitializationError;

import no.entur.abt.android.test.listener.XmlRunListener;

public class XmlRunListenerBlockJUnit4ClassRunner extends BlockJUnit4ClassRunner {

	public XmlRunListenerBlockJUnit4ClassRunner(Class<?> klass) throws InitializationError {
		super(klass);
	}

	@Override
	public void run(RunNotifier notifier) {
		XmlRunListener xmlRunListener = new XmlRunListener();
		xmlRunListener.setInstrumentation(InstrumentationRegistry.getInstrumentation());

		notifier.addListener(xmlRunListener);
		notifier.fireTestRunStarted(getDescription());
		super.run(notifier);
	}

}
