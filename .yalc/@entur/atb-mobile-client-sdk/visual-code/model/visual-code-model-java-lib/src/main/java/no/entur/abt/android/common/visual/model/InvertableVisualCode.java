/*-
 * #%L
 * Visual Inspection lib for android
 * %%
 * Copyright (C) 2019 Entur AS and original authors
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package no.entur.abt.android.common.visual.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;

/**
 * Invertable visual code. Wraps two visual codes.
 */
public class InvertableVisualCode {

	private static final String HASH_ALGORITHM = "SHA-256";
	private static final byte[] SALT = "SALT_AND_PEPPER_MAKES_FOOD_MORE_TASTY".getBytes(StandardCharsets.UTF_8);

	public static InvertableVisualCode create(byte[] visualInspectionNonce) throws InvalidVisualCodeException {
		return create(visualInspectionNonce, SALT);
	}

	public static InvertableVisualCode create(byte[] visualInspectionNonce, byte[] salt) throws InvalidVisualCodeException {

		try {
			// Create 256 bit hash using SHA-256
			MessageDigest md = MessageDigest.getInstance(HASH_ALGORITHM);
			md.update(salt);
			md.update(visualInspectionNonce);
			byte[] digest = md.digest();

			return createFromDigest(digest);
		} catch (NoSuchAlgorithmException ex) {
			throw new InvalidVisualCodeException("Hashing algorithm not supported: " + HASH_ALGORITHM, ex);
		}
	}

	public static InvertableVisualCode createFromDigest(byte[] digest) throws InvalidVisualCodeException {
		byte[] figureBasis = new byte[digest.length / 2];
		System.arraycopy(digest, 0, figureBasis, 0, figureBasis.length);
		VisualCode standard = new VisualCode(figureBasis);

		byte[] invertedFigureBasis = new byte[digest.length / 2];
		System.arraycopy(digest, figureBasis.length, invertedFigureBasis, 0, invertedFigureBasis.length);
		VisualCode inverted = new VisualCode(invertedFigureBasis);

		return new InvertableVisualCode(standard, inverted);
	}

	private final VisualCode standardView;
	private final VisualCode invertedView;
	private VisualCode currentView;

	public InvertableVisualCode(VisualCode standardView, VisualCode invertedView) {
		this.standardView = standardView;
		this.invertedView = invertedView;

		this.currentView = standardView;
	}

	public void invertedView() {
		currentView = invertedView;
	}

	public void standardView() {
		currentView = standardView;
	}

	public InvertableVisualCode withYellowFrame() {
		standardView.setFrame(true, 0xFFFFFF00);
		invertedView.setFrame(true, 0xFFFFFF00);
		return this;
	}

	public boolean isReversed() {
		return currentView == invertedView;
	}

	public VisualCode getCurrent() {
		return currentView;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		InvertableVisualCode that = (InvertableVisualCode) o;
		return standardView.equals(that.standardView) && invertedView.equals(that.invertedView);
	}

	@Override
	public int hashCode() {
		return Objects.hash(standardView, invertedView);
	}

	public VisualCode getInvertedView() {
		return invertedView;
	}

	public VisualCode getStandardView() {
		return standardView;
	}
}
