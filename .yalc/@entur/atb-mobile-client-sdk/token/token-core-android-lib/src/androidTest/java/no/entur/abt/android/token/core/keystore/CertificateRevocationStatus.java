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

/**
 * Certificate status.
 */
public class CertificateRevocationStatus {

	public final Status status;
	public final Reason reason;
	public final String comment;
	public final String expires;

	public CertificateRevocationStatus(Status status, Reason reason, String comment, String expires) {
		this.status = status;
		this.reason = reason;
		this.comment = comment;
		this.expires = expires;
	}

	public enum Status {
		REVOKED,
		SUSPENDED
	}

	public enum Reason {
		UNSPECIFIED,
		KEY_COMPROMISE,
		CA_COMPROMISE,
		SUPERSEDED,
		SOFTWARE_FLAW
	}

	public Status getStatus() {
		return status;
	}

	public Reason getReason() {
		return reason;
	}

	public String getComment() {
		return comment;
	}

	public String getExpires() {
		return expires;
	}
}
