package no.entur.abt.android.common.pki;

import static org.junit.jupiter.api.Assertions.assertFalse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.PublicKey;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.junit.jupiter.api.Test;

public class RawPublicKeyLocalRepositoryTest implements RawPublicKeyLocalRepository.Listener {

	@Override
	public void onPublicKeysCleared(RawPublicKeyLocalRepository repository, List<File> deleted, List<File> undeleted) {
		if (!undeleted.isEmpty()) {
			throw new RuntimeException("Unable to clear public keys " + undeleted);
		}
	}

	@Override
	public void onPublicKeysLoaded(RawPublicKeyLocalRepository repository, List<File> success, List<File> failure) {
		if (!failure.isEmpty()) {
			throw new RuntimeException("Unable to load public keys " + failure);
		}
	}

	@Override
	public void onPublicKeysUpdated(RawPublicKeyLocalRepository repository, List<File> added, List<File> deleted, List<File> undeleted, List<String> failure,
			List<File> remaining) {
		if (!undeleted.isEmpty()) {
			throw new RuntimeException("Unable to delete obsolete public keys " + undeleted);
		}
		if (!failure.isEmpty()) {
			throw new RuntimeException("Unable to import public keys " + failure);
		}
	}

	@Test
	public void testBase64() throws IOException {

		File file = new File("./src/test/resources/abt-challenge-sign-key_3193_1647356404.pub");

		try (InputStream resourceAsStream = new FileInputStream(file)) {
			byte[] certificateBytes = IOUtils.toByteArray(resourceAsStream);

			StaticResourcePublicKeyFileRepository r = new StaticResourcePublicKeyFileRepository(certificateBytes, "abt_test");

			String tmpdir = System.getProperty("java.io.tmpdir");
			File directory = new File(tmpdir, "test" + "_" + System.currentTimeMillis());
			directory.mkdirs();

			RawPublicKeyLocalRepository repo = new RawPublicKeyLocalRepository(directory, "test", "test", r, new BouncyCastleProvider(), this);

			repo.updatePublicKeys();
			List<PublicKey> publicKeys = repo.getPublicKeys();
			assertFalse(publicKeys.isEmpty());
		} catch (IOException e) {
			throw new IllegalStateException(e);
		}
	}

}
