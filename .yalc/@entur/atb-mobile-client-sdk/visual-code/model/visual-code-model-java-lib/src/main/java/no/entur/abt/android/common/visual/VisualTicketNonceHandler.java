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

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.stream.Collectors;

import no.entur.abt.android.common.visual.model.VisualTicketNonce;

public class VisualTicketNonceHandler {

	private static final int KEEP_HISTORIC_NONCE_HOURS = 5;

	private final Clock clock;

	private SortedSet<VisualTicketNonce> nonces = new TreeSet<>();

	public VisualTicketNonceHandler(Clock clock) {
		this.clock = clock;
	}

	public VisualTicketNonce getNonce(Instant time) {
		return nonces.stream().filter(n -> !time.isBefore(n.getValidFrom()) && time.isBefore(n.getValidTo())).findFirst().orElse(null);
	}

	public void updateNonces(Collection<VisualTicketNonce> newNonces) {

		Instant now = clock.instant();
		Instant historicLimit = now.minus(KEEP_HISTORIC_NONCE_HOURS, ChronoUnit.HOURS);

		Set<VisualTicketNonce> historicNonces = nonces.stream()
				.filter(n -> n.getValidFrom().isBefore(now) && n.getValidTo().isAfter(historicLimit))
				.collect(Collectors.toSet());

		SortedSet<VisualTicketNonce> updatedNonces = new TreeSet<>(historicNonces);
		updatedNonces.addAll(newNonces);

		nonces = updatedNonces;
	}

}
