package no.entur.abt.android.token;

import java.nio.charset.StandardCharsets;

public class DefaultTraceMapper implements TraceMapper<String> {
	@Override
	public byte[] toBytes(String trace) {
		return trace.getBytes(StandardCharsets.UTF_8);
	}

	@Override
	public String fromBytes(byte[] bytes) {
		return new String(bytes, StandardCharsets.UTF_8);
	}
}
