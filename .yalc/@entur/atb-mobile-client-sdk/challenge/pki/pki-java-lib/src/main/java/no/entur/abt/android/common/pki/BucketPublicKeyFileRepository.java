package no.entur.abt.android.common.pki;

import java.io.ByteArrayOutputStream;
import java.util.Iterator;
import java.util.NoSuchElementException;

import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

public class BucketPublicKeyFileRepository implements PublicKeyFileRepository {

	private static final String PKI_FILE_EXTENSION = ".pub";

	private static class BlobPKIFileEntry implements PKIFileEntry {

		private final Blob blob;
		private final String fileName;

		private BlobPKIFileEntry(Blob blob, String fileName) {
			this.blob = blob;
			this.fileName = fileName;
		}

		@Override
		public String getFileName() {
			return fileName;
		}

		public long getTimestamp() {
			return blob.getUpdateTime();
		}

		@Override
		public byte[] getBytes() {
			ByteArrayOutputStream bout = new ByteArrayOutputStream();
			blob.downloadTo(bout);
			byte[] bytes = bout.toByteArray();

			return PublicKeyParser.parsePublicKeyFromEncodedPublicKey(bytes);
		}
	}

	public static class BlobIterator implements Iterator<BlobPKIFileEntry> {

		private final Iterator<Blob> delegate;
		private BlobPKIFileEntry next;

		private BlobIterator(Iterator<Blob> delegate) {
			this.delegate = delegate;
		}

		@Override
		public boolean hasNext() {
			while (delegate.hasNext()) {
				Blob blob = delegate.next();
				if (!blob.isDirectory()) {
					String blobName = blob.getName();
					if (blobName.endsWith(PKI_FILE_EXTENSION)) {
						String fileName = blobName.substring(blobName.lastIndexOf("/") + 1);

						this.next = new BlobPKIFileEntry(blob, fileName);

						return true;
					}
				}
			}
			this.next = null;
			return false;
		}

		@Override
		public BlobPKIFileEntry next() {
			if (next == null) {
				throw new NoSuchElementException();
			}
			return next;
		}
	}

	private final String bucketName;
	private final String bucketPrefix;

	public BucketPublicKeyFileRepository(String bucketName, String bucketPrefix) {
		this.bucketName = bucketName;
		this.bucketPrefix = bucketPrefix;
	}

	@Override
	public Iterator<? extends PKIFileEntry> getFiles() {
		Storage storage = StorageOptions.getUnauthenticatedInstance().getService();

		Page<Blob> blobs = storage.list(this.bucketName, Storage.BlobListOption.prefix(bucketPrefix));

		return new BlobIterator(blobs.iterateAll().iterator());
	}

}
