package no.entur.abt.android.common.pki;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.Provider;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 *
 * Cache for "raw" public key bytes. <br>
 * <br>
 * In other words, this class caches the BASE64 output from the .pub files, not the .pub files themselves.
 *
 */

public class RawPublicKeyLocalRepository {

	private static final String LOG_TAG = RawPublicKeyLocalRepository.class.getName();

	public interface Listener {

		void onPublicKeysCleared(RawPublicKeyLocalRepository repository, List<File> deleted, List<File> undeleted);

		void onPublicKeysLoaded(RawPublicKeyLocalRepository repository, List<File> success, List<File> failure);

		void onPublicKeysUpdated(RawPublicKeyLocalRepository repository, List<File> added, List<File> deleted, List<File> undeleted, List<String> failure,
				List<File> remaining);
	}

	private static final String DECODED_FILE_EXTENSION = ".decoded";

	private static final Comparator<Entry> FILENAME_COMPARATOR = (a, b) -> a.file.getName().compareTo(b.file.getName());

	private static class Entry {
		private final File file;
		private final PublicKey key;

		private Entry(File file, PublicKey key) {
			this.file = file;
			this.key = key;
		}

		public PublicKey getKey() {
			return key;
		}

		public String getFileName() {
			return file.getName();
		}

		public File getFile() {
			return file;
		}

	}

	protected final File directory;
	protected final Provider provider;

	protected PublicKeyFileRepository fileRepository;
	protected String name; // for logging

	private List<Entry> keys;
	private final Listener listener;

	public RawPublicKeyLocalRepository(File path, String name, String relativePath, PublicKeyFileRepository fileRepository, Provider provider,
			Listener listener) {
		this.name = name;

		this.directory = new File(path, relativePath);
		if (!directory.exists()) {
			if (!directory.mkdirs()) {
				throw new IllegalStateException("Unable to create directory " + directory);
			}
		}

		this.fileRepository = fileRepository;
		this.provider = provider;
		this.listener = listener;
	}

	protected File[] getPublicKeyFiles() {
		return directory.listFiles((dir, filename) -> filename.endsWith(DECODED_FILE_EXTENSION));
	}

	public void deletePublicKeysFromFolder() {
		File[] publicKeyFiles = getPublicKeyFiles();
		if (null != publicKeyFiles && publicKeyFiles.length > 0) {
			List<File> deleted = new ArrayList<>(publicKeyFiles.length);
			List<File> remaining = new ArrayList<>(publicKeyFiles.length);

			for (File file : publicKeyFiles) {
				if (!file.delete()) {
					remaining.add(file);
				} else {
					deleted.add(file);
				}
			}
			if (listener != null) {
				listener.onPublicKeysCleared(this, deleted, remaining);
			}
		} else {
			if (listener != null) {
				listener.onPublicKeysCleared(this, Collections.emptyList(), Collections.emptyList());
			}
		}
	}

	protected List<Entry> loadPublicKeysFromFolder() {
		File[] publicKeyFiles = getPublicKeyFiles();
		if (null == publicKeyFiles) {
			return Collections.emptyList();
		}

		List<File> success = new ArrayList<>();
		List<File> failure = new ArrayList<>();

		List<Entry> results = new ArrayList<>();
		for (File file : publicKeyFiles) {
			try {
				PublicKey publicKey = loadPublicKey(file);
				results.add(new Entry(file, publicKey));

				success.add(file);
			} catch (Exception e) {
				// this should really never happen, as we already have checked the keys
				failure.add(file);
			}
		}

		Collections.sort(results, FILENAME_COMPARATOR);

		List<File> loaded = new ArrayList<>();

		for (Entry value : results) {
			File file = value.getFile();
			loaded.add(file);
		}

		if (listener != null) {
			listener.onPublicKeysLoaded(this, success, failure);
		}

		return results;
	}

	private PublicKey loadPublicKey(File file) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
		try (FileInputStream fin = new FileInputStream(file); DataInputStream din = new DataInputStream(fin);) {
			byte[] buffer = new byte[(int) file.length()];
			din.readFully(buffer);

			X509EncodedKeySpec spec = new X509EncodedKeySpec(buffer);
			KeyFactory keyFactory = getKeyFactory();
			return keyFactory.generatePublic(spec);
		}
	}

	public List<PublicKey> getPublicKeys() {
		ensureLoadedFromCache();
		return keys.stream().map(Entry::getKey).collect(Collectors.toList());
	}

	protected synchronized void ensureLoadedFromCache() {
		if (keys == null) {
			this.keys = loadPublicKeysFromFolder();
		}
	}

	public boolean updatePublicKeys() {
		ensureLoadedFromCache();

		Map<String, Entry> keyMap = this.keys.stream().collect(Collectors.toMap(Entry::getFileName, Function.identity()));

		List<Entry> results = new ArrayList<>();

		boolean status = true;

		List<File> added = new ArrayList<>(keyMap.size());
		List<String> failure = new ArrayList<>(keyMap.size());

		Iterator<? extends PublicKeyFileRepository.PKIFileEntry> files = fileRepository.getFiles();
		while (files.hasNext()) {
			PublicKeyFileRepository.PKIFileEntry next = files.next();

			String fileName = next.getFileName();
			String destinationFileName = fileName + DECODED_FILE_EXTENSION;

			Entry existingKey = keyMap.remove(destinationFileName);
			if (existingKey != null) {
				results.add(existingKey);
				continue;
			}

			// do not save certificate before we can read it
			try {
				KeyFactory keyFactory = getKeyFactory();

				byte[] bytes = next.getBytes();

				X509EncodedKeySpec spec = new X509EncodedKeySpec(bytes);
				PublicKey publicKey = keyFactory.generatePublic(spec);

				// read success, save it
				File newPublicKeyFile = new File(directory, destinationFileName);
				try (FileOutputStream fout = new FileOutputStream(newPublicKeyFile)) {
					fout.write(bytes);
				}

				// copy timestamp so that we can better sort the files later
				if (!newPublicKeyFile.setLastModified(next.getTimestamp())) {
					throw new IllegalStateException("Problem setting key timestamp for " + newPublicKeyFile);
				}
				results.add(new Entry(newPublicKeyFile, publicKey));

				added.add(newPublicKeyFile);
			} catch (Exception e) {
				failure.add(fileName);

				status = false;
			}
		}

		List<File> deleted = new ArrayList<>(keyMap.size());
		List<File> undeleted = new ArrayList<>(keyMap.size());

		if (!keyMap.isEmpty()) {
			Collection<Entry> values = keyMap.values();
			for (Entry value : values) {
				File file = value.getFile();

				if (file.delete()) {
					deleted.add(file);
				} else {
					undeleted.add(file);
				}
			}
		}

		Collections.sort(results, FILENAME_COMPARATOR);

		List<File> remaining = new ArrayList<>(keyMap.size());
		for (Entry entry : results) {
			remaining.add(entry.getFile());
		}

		this.keys = results;

		if (listener != null) {
			listener.onPublicKeysUpdated(this, added, deleted, undeleted, failure, remaining);
		}

		return status;
	}

	private KeyFactory getKeyFactory() throws NoSuchAlgorithmException {
		KeyFactory keyFactory;
		if (provider != null) {
			keyFactory = KeyFactory.getInstance("EC", provider);
		} else {
			keyFactory = KeyFactory.getInstance("EC");
		}
		return keyFactory;
	}

	public File getDirectory() {
		return directory;
	}
}
