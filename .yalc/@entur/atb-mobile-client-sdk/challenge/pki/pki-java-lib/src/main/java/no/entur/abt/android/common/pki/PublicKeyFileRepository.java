package no.entur.abt.android.common.pki;

import java.util.Iterator;

/**
 * 
 * Source of .pub files (remote or local).
 * 
 */

public interface PublicKeyFileRepository {

	<T extends PKIFileEntry> Iterator<T> getFiles();

	interface PKIFileEntry {
		String getFileName();

		byte[] getBytes();

		long getTimestamp();

	}

}
