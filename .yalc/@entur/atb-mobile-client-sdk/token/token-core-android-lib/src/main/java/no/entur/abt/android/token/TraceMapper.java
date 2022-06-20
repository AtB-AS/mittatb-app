package no.entur.abt.android.token;

/**
 * 
 * Helper class for serialization / deserialization of trace.
 * 
 * @param <T> trace (like the classic 'correlation-id')
 */

public interface TraceMapper<T> {

	byte[] toBytes(T trace);

	T fromBytes(byte[] bytes);

}
