package no.entur.abt.android.common.visual.model;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Base64;
import java.util.List;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

public class VisualCodeSerializer {

	private final JsonFactory jsonFactory;

	public VisualCodeSerializer() {
		jsonFactory = new JsonFactory();
	}

	public String serialize(byte[] nonce) throws IOException {
		StringWriter stringWriter = new StringWriter();
		try (JsonGenerator writer = jsonFactory.createGenerator(stringWriter).useDefaultPrettyPrinter()) {
			serialize(writer, nonce);
		}
		return stringWriter.toString();
	}

	public void serialize(JsonGenerator writer, byte[] nonce) throws IOException {

		InvertableVisualCode invertableVisualCode = InvertableVisualCode.create(nonce);

		writer.writeStartObject();

		writer.writeStringField("nonce", Base64.getEncoder().encodeToString(nonce));

		writer.writeFieldName("visualCode");

		writer.writeStartObject();

		writer.writeFieldName("standard");

		write(writer, invertableVisualCode.getStandardView());

		writer.writeFieldName("inverted");

		write(writer, invertableVisualCode.getInvertedView());

		writer.writeEndObject();

		writer.writeEndObject();
	}

	private void write(JsonGenerator writer, VisualCode invertedView) throws IOException {

		writer.writeStartObject();

		writer.writeStringField("primaryBackgroundColor", invertedView.getPrimaryBackgroundColor().toString());
		writer.writeStringField("secondaryBackgroundColor", invertedView.getSecondaryBackgroundColor().toString());

		writer.writeStringField("backgroundPattern", invertedView.getBackgroundPattern().toString());

		writer.writeFieldName("shapes");

		writer.writeStartArray();

		List<VisualCodeShape> shapes = invertedView.getShapes();

		for (VisualCodeShape shape : shapes) {
			writer.writeStartObject();

			writer.writeStringField("type", shape.getType().toString());
			writer.writeStringField("position", shape.getPosition().toString());
			writer.writeStringField("color", shape.getColor().toString());

			writer.writeEndObject();
		}

		writer.writeEndArray();

		writer.writeEndObject();

	}

}
