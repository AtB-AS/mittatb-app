package no.entur.abt.android.common.visual.model;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Random;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

public class VisualCodeTestcaseGenerator {

	private final JsonFactory jsonFactory;
	private final Random random;
	private final VisualCodeSerializer visualCodeSerializer = new VisualCodeSerializer();

	public VisualCodeTestcaseGenerator() {
		this(new SecureRandom());
	}

	public VisualCodeTestcaseGenerator(Random random) {
		this.jsonFactory = new JsonFactory();
		this.random = random;
	}

	public void write(int count, int nonceLength, File file) throws IOException {
		String write = write(count, nonceLength);

		try (FileOutputStream fout = new FileOutputStream(file)) {
			fout.write(write.getBytes(StandardCharsets.UTF_8));
		}
	}

	private String write(int count, int nonceLength) throws IOException {
		StringWriter stringWriter = new StringWriter();
		try (JsonGenerator writer = jsonFactory.createGenerator(stringWriter).useDefaultPrettyPrinter()) {
			writer.writeStartObject();
			writer.writeFieldName("nonces");
			writer.writeStartArray();

			for (int i = 0; i < count; i++) {
				byte[] nonce = new byte[nonceLength];
				random.nextBytes(nonce);

				visualCodeSerializer.serialize(writer, nonce);
			}

			writer.writeEndArray();
			writer.writeEndObject();

		}
		return stringWriter.toString();
	}

	public static final void main(String[] args) throws IOException {
		new VisualCodeTestcaseGenerator().write(128, 8, new File(args[0]));
	}

}
