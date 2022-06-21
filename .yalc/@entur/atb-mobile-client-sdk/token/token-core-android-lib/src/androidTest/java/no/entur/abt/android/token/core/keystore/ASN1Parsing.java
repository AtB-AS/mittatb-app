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

import java.math.BigInteger;

import org.bouncycastle.asn1.ASN1Boolean;
import org.bouncycastle.asn1.ASN1Encodable;
import org.bouncycastle.asn1.ASN1Enumerated;
import org.bouncycastle.asn1.ASN1Integer;

/**
 * Lifted from https://github.com/google/android-key-attestation/
 * 
 * Utils to get java representation of ASN1 types.
 */
class ASN1Parsing {

	static boolean getBooleanFromAsn1(ASN1Encodable asn1Value) {
		if (asn1Value instanceof ASN1Boolean) {
			return ((ASN1Boolean) asn1Value).isTrue();
		} else {
			throw new RuntimeException("Boolean value expected; found " + asn1Value.getClass().getName() + " instead.");
		}
	}

	static int getIntegerFromAsn1(ASN1Encodable asn1Value) {
		if (asn1Value instanceof ASN1Integer) {
			BigInteger value = ((ASN1Integer) asn1Value).getValue();
			return intValueExact(value);
		} else if (asn1Value instanceof ASN1Enumerated) {
			BigInteger value = ((ASN1Enumerated) asn1Value).getValue();
			return intValueExact(value);
		} else {
			throw new IllegalArgumentException("Integer value expected; found " + asn1Value.getClass().getName() + " instead.");
		}
	}

	public static int intValueExact(BigInteger value) {

		// XXX: mag.length <= 1 &&
		if (value.bitLength() <= 31)
			return value.intValue();
		else
			throw new ArithmeticException("BigInteger out of int range");
	}

}
