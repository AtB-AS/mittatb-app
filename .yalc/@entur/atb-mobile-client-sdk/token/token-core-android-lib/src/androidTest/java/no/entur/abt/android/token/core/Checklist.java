package no.entur.abt.android.token.core;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

public class Checklist<T> {

	private List<Check> list = new ArrayList<>();

	private int passed = 0;
	private int failed = 0;

	public void add(Check check) {
		list.add(check);

		if (check.isPass()) {
			passed++;
		} else {
			failed++;
		}
	}

	public String toString() {
		return new Gson().toJson(this);
	}

	public boolean hasFailed() {
		return failed > 0;
	}

	public List<Check> getList() {
		return list;
	}
}
