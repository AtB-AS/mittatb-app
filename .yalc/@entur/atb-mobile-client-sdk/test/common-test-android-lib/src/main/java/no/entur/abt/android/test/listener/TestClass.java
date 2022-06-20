package no.entur.abt.android.test.listener;

import java.util.Comparator;
import java.util.Objects;

public class TestClass {

	public static final Comparator<TestClass> START_TIME_COMPARATOR = new Comparator<TestClass>() {
		@Override
		public int compare(TestClass o1, TestClass o2) {
			return Long.compare(o1.getStartTime(), o2.getStartTime());
		}
	};

	private final String name;
	private long startTime;

	public TestClass(String name, long startTime) {
		this.name = name;
		this.startTime = startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	public long getStartTime() {
		return startTime;
	}

	public String getName() {
		return name;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		TestClass testClass = (TestClass) o;
		return startTime == testClass.startTime && name.equals(testClass.name);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, startTime);
	}
}
