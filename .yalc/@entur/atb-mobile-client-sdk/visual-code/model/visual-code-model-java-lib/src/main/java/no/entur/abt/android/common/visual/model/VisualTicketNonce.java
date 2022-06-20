package no.entur.abt.android.common.visual.model;

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

import java.time.Instant;
import java.util.Arrays;
import java.util.Objects;

/**
 * A Nonce used for visually verifying that a traveller has at least one valid access right within a given period.
 */
public class VisualTicketNonce implements Comparable<VisualTicketNonce> {

	private byte[] nonce;
	private Instant validFrom;
	private Instant validTo;

	public VisualTicketNonce(byte[] nonce, Instant validFrom, Instant validTo) {
		if (nonce == null) {
			throw new IllegalArgumentException();
		}
		if (validFrom == null) {
			throw new IllegalArgumentException();
		}
		if (validTo == null) {
			throw new IllegalArgumentException();
		}
		this.nonce = nonce;
		this.validFrom = validFrom;
		this.validTo = validTo;
	}

	public boolean isValid(Instant instant) {
		return isValid(instant.toEpochMilli());
	}

	public boolean isValid(long instant) {
		return validFrom.toEpochMilli() <= instant && instant < validTo.toEpochMilli();
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		VisualTicketNonce that = (VisualTicketNonce) o;
		return Arrays.equals(nonce, that.nonce) && validFrom.equals(that.validFrom) && validTo.equals(that.validTo);
	}

	@Override
	public int hashCode() {
		int result = Objects.hash(validFrom, validTo);
		result = 31 * result + Arrays.hashCode(nonce);
		return result;
	}

	@Override
	public int compareTo(VisualTicketNonce o) {
		return validFrom.compareTo(o.validFrom);
	}

	@Override
	public String toString() {
		return "VisualTicketNonce{valid " + validFrom + " to " + validTo + '}';
	}

	public byte[] getNonce() {
		return nonce;
	}

	public Instant getValidFrom() {
		return validFrom;
	}

	public Instant getValidTo() {
		return validTo;
	}
}
