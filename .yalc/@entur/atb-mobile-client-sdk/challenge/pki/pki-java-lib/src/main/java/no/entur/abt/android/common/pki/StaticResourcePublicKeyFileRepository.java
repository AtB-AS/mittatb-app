package no.entur.abt.android.common.pki;

import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class StaticResourcePublicKeyFileRepository implements PublicKeyFileRepository {

	private static class StaticPKIFileEntry implements PKIFileEntry {

		private final byte[] bytes;
		private final String name;

		private StaticPKIFileEntry(String name, byte[] bytes) {
			this.bytes = bytes;
			this.name = name;
		}

		@Override
		public long getTimestamp() {
			return 0L;
		}

		@Override
		public String getFileName() {
			return name;
		}

		@Override
		public byte[] getBytes() {
			return bytes;
		}
	}

	private final List<PKIFileEntry> keys;

	public StaticResourcePublicKeyFileRepository(byte[] certificateBytes, String name) throws IOException {
		byte[] decoded = PublicKeyParser.parsePublicKeyFromEncodedPublicKey(certificateBytes);

		keys = Arrays.asList(new StaticPKIFileEntry(name, decoded));
	}

	@Override
	public Iterator<? extends PKIFileEntry> getFiles() {
		return keys.iterator();
	}
}
