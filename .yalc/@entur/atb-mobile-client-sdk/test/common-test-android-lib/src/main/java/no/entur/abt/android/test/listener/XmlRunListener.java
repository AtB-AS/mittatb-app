package no.entur.abt.android.test.listener;

import android.app.Instrumentation;
import android.os.Build;
import android.util.Log;
import android.util.Xml;

import androidx.test.internal.runner.listener.InstrumentationRunListener;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.junit.runner.Description;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.xmlpull.v1.XmlSerializer;

/**
 * An InstrumentationRunListener which writes the test results to JUnit style XML files to the {@code /storage/emulated/0/Android/data/<package-name>/files/}
 * directory on the device.
 * <p>
 * This listener will not override existing XML reports and instead will generate unique file names for the report file (report-0.xml, report-1.xml ...).
 * <p>
 * This is useful for running within a orchestrated setup where each test runs in a separate process.
 * <p>
 * Note: It is necessary to uninstall the app from previous runs (clean up the report directory manually) before running the orchestrator or previous files will
 * persist.
 *
 * @see <a href=
 *      "https://developer.android.com/training/testing/junit-runner.html#using-android-test-orchestrator">https://developer.android.com/training/testing/junit-runner.html#using-android-test-orchestrator</a>
 */
public class XmlRunListener extends InstrumentationRunListener {
	private static final String TAG = XmlRunListener.class.getSimpleName();

	private static final String ENCODING_UTF_8 = "utf-8";
	private static final String NAMESPACE = null;

	private static final String TAG_SUITE = "testsuite";
	private static final String TAG_PROPERTIES = "properties";
	private static final String TAG_PROPERTY = "property";
	private static final String TAG_CASE = "testcase";
	private static final String TAG_FAILURE = "failure";
	private static final String TAG_SKIPPED = "skipped";

	private static final String TAG_CLASS = "class";

	private static final String ATTRIBUTE_CLASS = "classname";
	private static final String ATTRIBUTE_ERRORS = "errors";
	private static final String ATTRIBUTE_FAILURES = "failures";
	private static final String ATTRIBUTE_MESSAGE = "message";
	private static final String ATTRIBUTE_NAME = "name";
	private static final String ATTRIBUTE_SKIPPED = "skipped";
	private static final String ATTRIBUTE_TESTS = "tests";
	private static final String ATTRIBUTE_DURATION = "duration";
	private static final String ATTRIBUTE_TIMESTAMP = "timestamp";
	private static final String ATTRIBUTE_TYPE = "type";
	private static final String ATTRIBUTE_VALUE = "value";

	private static final String ATTRIBUTE_DONE = "done";

	private static final String ATTRIBUTE_START_TIME = "endTime";

	private File outputFile;

	private TestRunResult runResult = new TestRunResult();

	private long startTime = System.currentTimeMillis();

	@Override
	public void setInstrumentation(Instrumentation instr) {
		super.setInstrumentation(instr);

		try {
			outputFile = getOutputFile(instr);

			Log.d(TAG, "setInstrumentation: outputFile: " + outputFile);
			printTestResults(false);
		} catch (IOException e) {

			Log.e(TAG, "Unable to create report file", e);
			throw new RuntimeException("Unable to open report file: " + e.getMessage(), e);
		}
	}

	/**
	 * Get a {@link File} for the test report.
	 * <p>
	 * Override this to change the default file location.
	 *
	 * @param instrumentation the {@link Instrumentation} for this test run
	 * @return the file which should be used to store the XML report of the test run
	 */
	protected File getOutputFile(Instrumentation instrumentation) {
		// Seems like we need to put this into the target application's context as for the instrumentation app's
		// context we can never be sure if we have the correct permissions - and getFilesDir() seems to return null
		return new File(instrumentation.getTargetContext().getExternalFilesDir(null), getFileName(instrumentation));
	}

	/**
	 * Get a file name for the test report.
	 * <p>
	 * Override this to create different file patterns.
	 *
	 * @param instrumentation the {@link Instrumentation} for this test run
	 * @return the file name which should be used to store the XML report of the test run
	 */
	protected String getFileName(Instrumentation instrumentation) {
		return findFile("report", 0, ".xml", instrumentation);
	}

	private String findFile(String fileNamePrefix, int iterator, String fileNamePostfix, Instrumentation instr) {
		String fileName = fileNamePrefix + "-" + iterator + fileNamePostfix;
		File file = new File(instr.getTargetContext().getExternalFilesDir(null), fileName);

		if (file.exists()) {
			return findFile(fileNamePrefix, iterator + 1, fileNamePostfix, instr);
		} else {
			return file.getName();
		}
	}

	@Override
	public void testRunStarted(Description description) throws Exception {
		runResult = new TestRunResult();
		runResult.runStarted(description);
		printTestResults();
	}

	@Override
	public void testRunFinished(Result result) throws Exception {
		runResult.runFinished(result);

		printTestResults(true);
	}

	@Override
	public void testStarted(Description description) throws Exception {
		runResult.testStarted(description);
		printTestResults();
	}

	@Override
	public void testFinished(Description description) throws Exception {
		runResult.testFinished(description);
		printTestResults();
	}

	@Override
	public void testFailure(Failure failure) throws Exception {
		runResult.testFailure(failure);
		printTestResults();
	}

	@Override
	public void testAssumptionFailure(Failure failure) {
		runResult.testAssumptionFailure(failure);
		printTestResults();
	}

	@Override
	public void testIgnored(Description description) throws Exception {
		runResult.testIgnored(description);

		printTestResults();
	}

	private void printTestResults() {
		try {
			printTestResults(false);
		} catch (IOException e) {
			Log.d(TAG, "Problem printing test results", e);
		}
	}

	private void printTestResults(boolean finished) throws IOException {
		ByteArrayOutputStream bout = new ByteArrayOutputStream();

		final XmlSerializer xmlSerializer = getXmlSerializer(bout);

		xmlSerializer.startTag(NAMESPACE, TAG_SUITE);
		String name = runResult.getTestSuiteName();
		if (name != null && name.isEmpty()) {
			xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_NAME, name);
		}
		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_TESTS, Integer.toString(runResult.getAllTests().size()));

		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_DONE, finished ? Boolean.TRUE.toString() : Boolean.FALSE.toString());

		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_FAILURES,
				Integer.toString(runResult.getFailedTests().size() + runResult.getAssumptionFailedTests().size()));

		// legacy - there are no errors in JUnit4
		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_ERRORS, "0");
		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_SKIPPED, Integer.toString(runResult.getIgnoredTests().size()));

		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_DURATION, Double.toString((double) runResult.getElapsedTime() / 1000.f));
		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_TIMESTAMP, runResult.startTimeAsIso());

		xmlSerializer.startTag(NAMESPACE, TAG_PROPERTIES);
		printProperty(xmlSerializer, "device.manufacturer", Build.MANUFACTURER);
		printProperty(xmlSerializer, "device.model", Build.MODEL);
		printProperty(xmlSerializer, "device.apiLevel", String.valueOf(Build.VERSION.SDK_INT));
		xmlSerializer.endTag(NAMESPACE, TAG_PROPERTIES);

		DecimalFormat formatter = new DecimalFormat("#0.00");

		TreeMap<TestClass, List<TestResult>> testClasses = runResult.getAllTests();
		for (Map.Entry<TestClass, List<TestResult>> testClassListEntry : testClasses.entrySet()) {
			xmlSerializer.startTag(NAMESPACE, TAG_CLASS);

			TestClass key = testClassListEntry.getKey();
			xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_CLASS, key.getName());
			xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_START_TIME, Long.toString((key.getStartTime() - runResult.getStartTime()) / 1000));

			for (TestResult testResult : testClassListEntry.getValue()) {
				Description descriptor = testResult.getDescriptor();

				xmlSerializer.startTag(NAMESPACE, TAG_CASE);

				String displayName = descriptor.getDisplayName();
				if (displayName.contains(key.getName())) {
					int index = displayName.indexOf('(');
					if (index != -1) {
						displayName = displayName.substring(0, index);
					}
				}

				xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_NAME, displayName);
				long elapsedTimeMs = testResult.getElapsedTime();
				xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_DURATION, formatter.format(elapsedTimeMs / 1000d));

				xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_START_TIME, formatter.format((testResult.getStartTime() - startTime) / 1000d));

				switch (testResult.getStatus()) {
				case FAILURE:
					Failure failure = testResult.getFailure();
					xmlSerializer.startTag(NAMESPACE, TAG_FAILURE);

					String type = failure.getException().getClass().getName();
					if (type != null && !type.isEmpty()) {
						xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_TYPE, type);
					}

					String message = failure.getMessage();
					if (message != null && !message.isEmpty()) {
						xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_MESSAGE, message);
					}

					xmlSerializer.text(testResult.getFailure().getTrace());
					xmlSerializer.endTag(NAMESPACE, TAG_FAILURE);
					break;

				case ASSUMPTION_FAILURE:
				case IGNORED:
					xmlSerializer.startTag(NAMESPACE, TAG_SKIPPED);
					xmlSerializer.endTag(NAMESPACE, TAG_SKIPPED);
					break;
				}

				xmlSerializer.endTag(NAMESPACE, TAG_CASE);
			}
			xmlSerializer.endTag(NAMESPACE, TAG_CLASS);
		}

		xmlSerializer.endTag(NAMESPACE, TAG_SUITE);
		xmlSerializer.endDocument();
		xmlSerializer.flush();

		if (outputFile != null) {
			FileOutputStream outputStream = new FileOutputStream(outputFile);
			try {
				outputStream.write(bout.toByteArray());
			} finally {
				outputStream.close();
			}
		} else {
			Log.d(TAG, "No output specified, has instrumentation been set?");
		}
	}

	private XmlSerializer getXmlSerializer(OutputStream bout) {
		try {
			XmlSerializer xmlSerializer = Xml.newSerializer();
			xmlSerializer.setFeature("http://xmlpull.org/v1/doc/features.html#indent-output", true);
			xmlSerializer.setOutput(bout, ENCODING_UTF_8);
			xmlSerializer.startDocument(ENCODING_UTF_8, true);
			return xmlSerializer;
		} catch (IOException e) {
			Log.e(TAG, "Unable to open serializer", e);
			throw new RuntimeException("Unable to open serializer: " + e.getMessage(), e);
		}
	}

	private void printProperty(XmlSerializer xmlSerializer, String name, String value) throws IOException {
		xmlSerializer.startTag(NAMESPACE, TAG_PROPERTY);
		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_NAME, name);
		xmlSerializer.attribute(NAMESPACE, ATTRIBUTE_VALUE, value);
		xmlSerializer.endTag(NAMESPACE, TAG_PROPERTY);
	}

}
