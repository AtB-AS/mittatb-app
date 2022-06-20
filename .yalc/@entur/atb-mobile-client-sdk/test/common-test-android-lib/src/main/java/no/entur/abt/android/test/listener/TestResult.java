package no.entur.abt.android.test.listener;

import java.util.Comparator;

import org.junit.runner.Description;
import org.junit.runner.notification.Failure;

public class TestResult {

	public static final Comparator<TestResult> START_TIME_COMPARATOR = new Comparator<TestResult>() {
		@Override
		public int compare(TestResult o1, TestResult o2) {
			return Long.compare(o1.getStartTime(), o2.getStartTime());
		}
	};

	public enum Status {
		STARTED,

		FAILURE,

		ASSUMPTION_FAILURE,

		IGNORED,

		PASSED
	}

	private final Description descriptor;

	private Status status;

	private Failure failure;

	// the start and end time of the test, measured via {@link System#currentTimeMillis()}
	private long startTime;
	private long endTime;

	public TestResult(Description descriptor) {
		this.descriptor = descriptor;

		status = Status.STARTED;
		startTime = System.currentTimeMillis();
	}

	public void recordFailure(Failure failure) {
		this.failure = failure;
		this.status = Status.FAILURE;
	}

	public void recordAssumptionFailure(Failure failure) {
		this.failure = failure;
		this.status = Status.ASSUMPTION_FAILURE;
	}

	public void recordTestIgnored() {
		this.status = Status.IGNORED;
	}

	public void recordFinished() {
		if (this.status == Status.STARTED) {
			this.status = Status.PASSED;
		}

		endTime = System.currentTimeMillis();
	}

	public long getElapsedTime() {
		long endTime = this.endTime;

		if (endTime == 0) {
			endTime = System.currentTimeMillis();
		}

		return endTime - startTime;
	}

	public long getEndTime() {
		return endTime;
	}

	public long getStartTime() {
		return startTime;
	}

	public Status getStatus() {
		return status;
	}

	public Description getDescriptor() {
		return descriptor;
	}

	public Failure getFailure() {
		return failure;
	}
}
