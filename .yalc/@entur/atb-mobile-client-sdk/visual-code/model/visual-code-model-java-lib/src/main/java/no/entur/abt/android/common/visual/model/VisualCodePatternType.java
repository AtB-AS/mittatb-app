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

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public enum VisualCodePatternType {
	UNIFORM(0),
	HORIZONTAL_STRIPES(1),
	VERTICAL_STRIPES(2);

	// Tie the enum to the constant defined in the spec
	private final int index;

	VisualCodePatternType(int index) {
		this.index = index;
	}

	public int getIndex() {
		return index;
	}

	public static List<VisualCodePatternType> listByIndex() {
		List<VisualCodePatternType> colors = new ArrayList<>();

		for (VisualCodePatternType value : values()) {
			colors.add(value);
		}

		Collections.sort(colors, Comparator.comparingInt(VisualCodePatternType::getIndex));

		return colors;
	}

}
