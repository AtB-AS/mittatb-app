/* Copyright 2019, The Android Open Source Project, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package no.entur.abt.android.token.core.keystore;

import android.content.Context;
import android.content.res.Resources;

import androidx.annotation.NonNull;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Utils for fetching and decoding attestation certificate status.
 */
public class AndroidCertificateRevocationStatusService {

	private static String LOG_TAG = AndroidCertificateRevocationStatusService.class.getName();

	protected String statusServiceUrl = "https://android.googleapis.com/attestation/status";

	private Map<String, CertificateRevocationStatus> localCache;

	// i.e. getInstrumentation().getContext()
	public AndroidCertificateRevocationStatusService(Context context) throws IOException {
		try {
			localCache = load();
		} catch (Exception e) {
			// get from local cache, this is pretty static data but loading
			// sometimes fails in testlab
			localCache = loadFromLocalCache(context);
		}
	}

	private Map<String, CertificateRevocationStatus> loadFromLocalCache(Context context) throws IOException {
		byte[] resource = getResource(no.entur.abt.client.sdk.token.core.test.R.raw.attestation, context);
		try (InputStreamReader statusListReader = new InputStreamReader(new ByteArrayInputStream(resource))) {
			return getStringCertificateRevocationStatusMap(statusListReader);
		}
	}

	public CertificateRevocationStatus getStatus(BigInteger serialNumber) {
		return getStatus(serialNumber.toString(16));
	}

	public CertificateRevocationStatus getStatus(String serialNumber) {
		return localCache.get(serialNumber);
	}

	private Map<String, CertificateRevocationStatus> load() throws IOException {
		URL url;
		try {
			url = new URL(statusServiceUrl);
		} catch (MalformedURLException e) {
			throw new IllegalStateException(e);
		}

		try (InputStreamReader statusListReader = new InputStreamReader(url.openStream())) {
			return getStringCertificateRevocationStatusMap(statusListReader);
		}
	}

	@NonNull
	private Map<String, CertificateRevocationStatus> getStringCertificateRevocationStatusMap(InputStreamReader statusListReader) {
		JsonObject entries = JsonParser.parseReader(statusListReader).getAsJsonObject().getAsJsonObject("entries");

		Map<String, CertificateRevocationStatus> cache = new HashMap<>();

		Gson gson = new Gson();

		entries.entrySet().forEach(entry -> cache.put(entry.getKey(), gson.fromJson(entry.getValue(), CertificateRevocationStatus.class)));

		return cache;
	}

	// reads resources regardless of their size
	public byte[] getResource(int id, Context context) throws IOException {
		Resources resources = context.getResources();
		InputStream is = resources.openRawResource(id);

		ByteArrayOutputStream bout = new ByteArrayOutputStream();

		byte[] readBuffer = new byte[4 * 1024];

		try {
			int read;
			do {
				read = is.read(readBuffer, 0, readBuffer.length);
				if (read == -1) {
					break;
				}
				bout.write(readBuffer, 0, read);
			} while (true);

			return bout.toByteArray();
		} finally {
			is.close();
		}
	}

}
