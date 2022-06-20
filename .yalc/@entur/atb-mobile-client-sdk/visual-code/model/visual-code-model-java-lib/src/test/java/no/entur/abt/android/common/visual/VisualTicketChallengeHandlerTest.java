package no.entur.abt.android.common.visual;

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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.Clock;
import java.time.Instant;
import java.util.Arrays;
import java.util.Random;

import org.junit.jupiter.api.Test;

import no.entur.abt.android.common.visual.model.VisualTicketNonce;

public class VisualTicketChallengeHandlerTest {

	@Test
	public void testUpdateNonces() {
		Instant now = Instant.now();

		VisualTicketNonceHandler handler = new VisualTicketNonceHandler(Clock.systemDefaultZone());
		assertNull(handler.getNonce(Instant.now()));

		VisualTicketNonce historic = nonce(now.minusSeconds(15), now.minusSeconds(5));
		VisualTicketNonce current = nonce(now.minusSeconds(5), now.plusSeconds(5));
		VisualTicketNonce future = nonce(now.plusSeconds(5), now.plusSeconds(15));

		handler.updateNonces(Arrays.asList(historic, current, future));

		assertNull(handler.getNonce(now.minusSeconds(16)));
		assertEquals(historic, handler.getNonce(now.minusSeconds(15)));
		assertEquals(current, handler.getNonce(now.minusSeconds(5)));
		assertEquals(current, handler.getNonce(now));
		assertEquals(current, handler.getNonce(now.plusSeconds(4)));
		assertEquals(future, handler.getNonce(now.plusSeconds(5)));
		assertNull(handler.getNonce(now.plusSeconds(15)));

		handler.updateNonces(Arrays.asList(current, future));
		assertEquals(historic, handler.getNonce(now.minusSeconds(15)));
		assertEquals(current, handler.getNonce(now));
		assertEquals(future, handler.getNonce(now.plusSeconds(5)));
	}

	private VisualTicketNonce nonce(Instant from, Instant to) {
		byte[] random = new byte[128];
		new Random().nextBytes(random);
		return new VisualTicketNonce(random, from, to);
	}
}
