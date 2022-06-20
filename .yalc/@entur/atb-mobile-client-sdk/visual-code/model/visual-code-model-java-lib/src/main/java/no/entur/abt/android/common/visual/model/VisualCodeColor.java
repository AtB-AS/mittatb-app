package no.entur.abt.android.common.visual.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public enum VisualCodeColor {

	BLACK(0xFF000000, 0),
	WHITE(0xFFFFFFFF, 1),
	BLUE(0xFF0000FF, 2),
	GREEN(0xFF00FF00, 3),
	RED(0xFFFF0000, 4);

	private final int color;

	// Tie the enum to the constant defined in the spec
	private final int index;

	private VisualCodeColor(int color, int index) {
		this.color = color;
		this.index = index;
	}

	public int getIndex() {
		return index;
	}

	public int getColor() {
		return color;
	}

	public static List<VisualCodeColor> listByIndex() {
		List<VisualCodeColor> colors = new ArrayList<>();

		for (VisualCodeColor value : values()) {
			colors.add(value);
		}

		Collections.sort(colors, Comparator.comparingInt(VisualCodeColor::getIndex));

		return colors;
	}
}
