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

import java.util.Objects;

public class VisualCodeShape {

	private VisualCodeShapeType type;

	private VisualCodeShapePosition position;

	private VisualCodeColor color;

	public VisualCodeShape(VisualCodeShapeType type, VisualCodeShapePosition position, VisualCodeColor color) {
		if (type == null) {
			throw new IllegalArgumentException();
		}
		if (position == null) {
			throw new IllegalArgumentException();
		}
		this.type = type;
		this.position = position;
		this.color = color;
	}

	public VisualCodeShapeType getType() {
		return type;
	}

	public VisualCodeShapePosition getPosition() {
		return position;
	}

	public VisualCodeColor getColor() {
		return color;
	}

	@Override
	public String toString() {
		return "VisualCodeShape{" + "type=" + type + ", position=" + position + ", color=" + color + '}';
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		VisualCodeShape that = (VisualCodeShape) o;
		return color == that.color && type == that.type && position == that.position;
	}

	@Override
	public int hashCode() {
		return Objects.hash(type, position, color);
	}
}
