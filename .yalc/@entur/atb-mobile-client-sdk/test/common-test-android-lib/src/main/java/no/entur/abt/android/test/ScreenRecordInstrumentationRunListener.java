package no.entur.abt.android.test;

import android.util.Log;

import androidx.test.internal.runner.listener.InstrumentationRunListener;

import org.junit.runner.Description;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

// this requires instrumentation parameter -e no-isolated-storage 1 to work

public class ScreenRecordInstrumentationRunListener extends InstrumentationRunListener {

	private static final String LOG_TAG = ScreenRecordInstrumentationRunListener.class.getName();

	/**
	 * Called before any tests have been run. This may be called on an arbitrary thread.
	 *
	 * @param description describes the tests to be run
	 */
	public void testRunStarted(Description description) throws Exception {
		Log.d(LOG_TAG, "testRunStarted: " + description);
	}

	/**
	 * Called when all tests have finished. This may be called on an arbitrary thread.
	 *
	 * @param result the summary of the test run, including all the tests that failed
	 */
	public void testRunFinished(Result result) throws Exception {
		Log.d(LOG_TAG, "testRunFinished: " + result);
	}

	/**
	 * Called when a test suite is about to be started. If this method is called for a given {@link Description}, then {@link #testSuiteFinished(Description)}
	 * will also be called for the same {@code Description}.
	 *
	 * <p>
	 * Note that not all runners will call this method, so runners should be prepared to handle {@link #testStarted(Description)} calls for tests where there
	 * was no corresponding {@code testSuiteStarted()} call for the parent {@code Description}.
	 *
	 * @param description the description of the test suite that is about to be run (generally a class name)
	 * @since 4.13
	 */
	public void testSuiteStarted(Description description) throws Exception {
		Log.d(LOG_TAG, "testSuiteStarted: " + description);
	}

	/**
	 * Called when a test suite has finished, whether the test suite succeeds or fails. This method will not be called for a given {@link Description} unless
	 * {@link #testSuiteStarted(Description)} was called for the same @code Description}.
	 *
	 * @param description the description of the test suite that just ran
	 * @since 4.13
	 */
	public void testSuiteFinished(Description description) throws Exception {
		if (description.getClassName() != null && !description.getClassName().equals("null")) {
			Log.d(LOG_TAG, "testSuiteFinished: " + description.getClassName());
		}
	}

	/**
	 * Called when an atomic test is about to be started.
	 *
	 * @param description the description of the test that is about to be run (generally a class and method name)
	 */
	public void testStarted(Description description) throws Exception {
		Log.d(LOG_TAG, "testStarted: " + toFileName(description));
	}

	private String toFileName(Description description) {
		String className = description.getClassName();
		String simpleClassName = className.substring(className.lastIndexOf('.') + 1);
		String methodName = description.getMethodName();
		if (methodName != null) {
			return simpleClassName + "." + methodName;
		}
		return simpleClassName;
	}

	/**
	 * Called when an atomic test has finished, whether the test succeeds or fails.
	 *
	 * @param description the description of the test that just ran
	 */
	public void testFinished(Description description) throws Exception {
		Log.d(LOG_TAG, "testFinished: " + description);
	}

	/**
	 * Called when an atomic test fails, or when a listener throws an exception.
	 *
	 * <p>
	 * In the case of a failure of an atomic test, this method will be called with the same {@code Description} passed to {@link #testStarted(Description)},
	 * from the same thread that called {@link #testStarted(Description)}.
	 *
	 * <p>
	 * In the case of a listener throwing an exception, this will be called with a {@code Description} of {@link Description#TEST_MECHANISM}, and may be called
	 * on an arbitrary thread.
	 *
	 * @param failure describes the test that failed and the exception that was thrown
	 */
	public void testFailure(Failure failure) throws Exception {
		Log.d(LOG_TAG, "testFailure: " + failure);
	}

	/**
	 * Called when an atomic test flags that it assumes a condition that is false
	 *
	 * @param failure describes the test that failed and the {@link org.junit.AssumptionViolatedException} that was thrown
	 */
	public void testAssumptionFailure(Failure failure) {
		Log.d(LOG_TAG, "testAssumptionFailure: " + failure);
	}

	/**
	 * Called when a test will not be run, generally because a test method is annotated with {@link org.junit.Ignore}.
	 *
	 * @param description describes the test that will not be run
	 */
	public void testIgnored(Description description) throws Exception {
		Log.d(LOG_TAG, "testIgnored: " + description);
	}
}
