package no.entur.abt.android.test.listener;

import android.util.Log;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;

import org.junit.runner.Description;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class TestRunResult {

	private static final String TAG = TestRunResult.class.getSimpleName();

	private Description testRun;

	private Map<Description, no.entur.abt.android.test.listener.TestResult> allTests = new HashMap<>();

	private List<no.entur.abt.android.test.listener.TestResult> failedTests = new ArrayList<>();
	private List<no.entur.abt.android.test.listener.TestResult> assumptionFailedTests = new ArrayList<>();
	private List<no.entur.abt.android.test.listener.TestResult> ignoredTests = new ArrayList<>();
	private List<no.entur.abt.android.test.listener.TestResult> passedTests = new ArrayList<>();

	private long startTime = 0;
	private long endTime = 0;

	public void runStarted(Description description) {
		startTime = System.currentTimeMillis();
		testRun = description;
	}

	public void testStarted(Description description) throws Exception {
		allTests.put(description, new no.entur.abt.android.test.listener.TestResult(description));
	}

	public void testFailure(Failure failure) throws Exception {
		no.entur.abt.android.test.listener.TestResult testResult = allTests.get(failure.getDescription());
		testResult.recordFailure(failure);
		failedTests.add(testResult);
	}

	public void testAssumptionFailure(Failure failure) {
		no.entur.abt.android.test.listener.TestResult testResult = allTests.get(failure.getDescription());
		testResult.recordAssumptionFailure(failure);
		assumptionFailedTests.add(testResult);
	}

	public void testIgnored(Description description) throws Exception {
		no.entur.abt.android.test.listener.TestResult testResult = allTests.get(description);

		if (testResult == null) {
			testResult = new no.entur.abt.android.test.listener.TestResult(description);
			allTests.put(description, testResult);
		}

		testResult.recordTestIgnored();
		ignoredTests.add(testResult);
	}

	public void testFinished(Description description) throws Exception {
		endTime = System.currentTimeMillis();

		no.entur.abt.android.test.listener.TestResult testResult = allTests.get(description);

		// will be null for ignored tests!
		if (testResult == null) {
			return;
		}

		testResult.recordFinished();

		if (testResult.getStatus() == no.entur.abt.android.test.listener.TestResult.Status.STARTED) {
			passedTests.add(testResult);
		}
	}

	public void runFinished(Result result) {
		Log.d(TAG, "testRunFinished() called with: " + "result = [" + result + "]");
	}

	public String getTestSuiteName() {
		if (testRun != null) {
			return testRun.getDisplayName();
		} else {
			return null;
		}
	}

	public TreeMap<TestClass, List<TestResult>> getAllTests() {
		List<no.entur.abt.android.test.listener.TestResult> list = new ArrayList<>(allTests.values());

		Collections.sort(list, TestResult.START_TIME_COMPARATOR);

		Map<String, TestClass> map = new HashMap<>();
		for (TestResult testResult : list) {
			String className = testResult.getDescriptor().getClassName();
			TestClass testClass = map.get(className);
			if (testClass == null) {
				testClass = new TestClass(className, testResult.getStartTime());
				map.put(className, testClass);
			}
		}

		TreeMap<TestClass, List<TestResult>> sortedMap = new TreeMap<>(TestClass.START_TIME_COMPARATOR);

		for (TestResult testResult : list) {
			TestClass c = map.get(testResult.getDescriptor().getClassName());

			List<TestResult> testResults = sortedMap.get(c);
			if (testResults == null) {
				testResults = new ArrayList<>();
				sortedMap.put(c, testResults);
			}

			testResults.add(testResult);
		}

		return sortedMap;
	}

	public List<no.entur.abt.android.test.listener.TestResult> getPassedTests() {
		return passedTests;
	}

	public List<no.entur.abt.android.test.listener.TestResult> getIgnoredTests() {
		return ignoredTests;
	}

	public List<no.entur.abt.android.test.listener.TestResult> getAssumptionFailedTests() {
		return assumptionFailedTests;
	}

	public List<TestResult> getFailedTests() {
		return failedTests;
	}

	public long getElapsedTime() {
		long endTime = this.endTime;

		if (endTime == 0) {
			endTime = System.currentTimeMillis();
		}

		return endTime - startTime;
	}

	public String startTimeAsIso() {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'"); // Quoted "Z" to indicate UTC, no timezone offset
		df.setTimeZone(TimeZone.getTimeZone("UTC"));
		return df.format(new Date(startTime));
	}

	public long getStartTime() {
		return startTime;
	}
}
