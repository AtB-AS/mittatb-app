package no.entur.abt.android.common.visual.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.TreeMap;

public class VisualCodeStatistics {

	private final int percent; // tolerance

	private Map<VisualCodeShapePosition, Map<VisualCodeShapeType, Integer>> shapeTypes = new TreeMap<>();

	private Map<VisualCodeShapePosition, Map<VisualCodeColor, Integer>> colors = new TreeMap<>();

	private Map<VisualCodeColor, Integer> foregroundColors = new TreeMap<>();
	private Map<VisualCodeColor, Integer> backgroundColors = new TreeMap<>();
	private Map<VisualCodePatternType, Integer> backgroundPatterns = new TreeMap<>();

	public VisualCodeStatistics(int percent) {
		this.percent = percent;
	}

	public void add(VisualCodeShape shape) {
		Map<VisualCodeShapeType, Integer> map = shapeTypes.computeIfAbsent(shape.getPosition(), p -> new TreeMap<>());
		Integer integer = map.computeIfAbsent(shape.getType(), t -> 0);
		map.put(shape.getType(), integer + 1);

		Map<VisualCodeColor, Integer> colorMap = colors.computeIfAbsent(shape.getPosition(), p -> new TreeMap<>());
		Integer colorInteger = colorMap.computeIfAbsent(shape.getColor(), t -> 0);
		colorMap.put(shape.getColor(), colorInteger + 1);
	}

	public Map<VisualCodeShapePosition, Map<VisualCodeShapeType, Integer>> getShapeTypes() {
		return shapeTypes;
	}

	public void add(VisualCode current) {
		for (VisualCodeShape shape : current.getShapes()) {
			add(shape);
		}

		Integer patternCount = backgroundPatterns.computeIfAbsent(current.getBackgroundPattern(), t -> 0);
		backgroundPatterns.put(current.getBackgroundPattern(), patternCount + 1);

		Integer foregroundCount = foregroundColors.computeIfAbsent(current.getPrimaryBackgroundColor(), t -> 0);
		foregroundColors.put(current.getPrimaryBackgroundColor(), foregroundCount + 1);

		Integer backgroundCount = backgroundColors.computeIfAbsent(current.getSecondaryBackgroundColor(), t -> 0);
		backgroundColors.put(current.getSecondaryBackgroundColor(), backgroundCount + 1);

	}

	public void assertUniformShapeColorDistribution() {
		Map<VisualCodeShapePosition, Integer> counts = new TreeMap<>();

		for (Map.Entry<VisualCodeShapePosition, Map<VisualCodeColor, Integer>> entry : colors.entrySet()) {

			Map<VisualCodeColor, Integer> value = entry.getValue();
			assertEquals(value.size(), VisualCodeColor.values().length);

			int sum = 0;
			for (Map.Entry<VisualCodeColor, Integer> type : value.entrySet()) {
				sum += type.getValue();
			}

			counts.put(entry.getKey(), sum);
		}

		Integer centerCount = counts.remove(VisualCodeShapePosition.CENTER); // one in 16

		int sum = 0;
		for (Map.Entry<VisualCodeShapePosition, Integer> visualCodeShapePositionIntegerEntry : counts.entrySet()) {
			sum += visualCodeShapePositionIntegerEntry.getValue();
		}

		int offset = (percent * sum) / (100 * counts.size());

		int average = sum / counts.size();

		int minLimit = average - offset;
		int maxLimit = average + offset;

		for (Map.Entry<VisualCodeShapePosition, Integer> type : counts.entrySet()) {
			Integer count = type.getValue();

			assertTrue(minLimit < count && count < maxLimit);
		}

	}

	public void assertUniformShapeDistribution() {
		for (Map.Entry<VisualCodeShapePosition, Map<VisualCodeShapeType, Integer>> entry : shapeTypes.entrySet()) {

			Map<VisualCodeShapeType, Integer> value = entry.getValue();
			assertEquals(value.size(), VisualCodeShapeType.values().length);

			int sum = 0;
			for (Map.Entry<VisualCodeShapeType, Integer> type : value.entrySet()) {
				sum += type.getValue();
			}

			int offset = (percent * sum) / (100 * value.size());

			int average = sum / value.size();

			int minLimit = average - offset;
			int maxLimit = average + offset;

			for (Map.Entry<VisualCodeShapeType, Integer> type : value.entrySet()) {
				Integer count = type.getValue();

				assertTrue(minLimit < count && count < maxLimit);
			}

		}

	}

	public void assertUniformShapePositionExceptFromCenter() {
		Map<VisualCodeShapePosition, Integer> counts = new TreeMap<>();

		for (Map.Entry<VisualCodeShapePosition, Map<VisualCodeShapeType, Integer>> entry : shapeTypes.entrySet()) {

			Map<VisualCodeShapeType, Integer> value = entry.getValue();
			assertEquals(value.size(), VisualCodeShapeType.values().length);

			int sum = 0;
			for (Map.Entry<VisualCodeShapeType, Integer> type : value.entrySet()) {
				sum += type.getValue();
			}

			counts.put(entry.getKey(), sum);
		}

		Integer centerCount = counts.remove(VisualCodeShapePosition.CENTER); // one in 16

		int sum = 0;
		for (Map.Entry<VisualCodeShapePosition, Integer> visualCodeShapePositionIntegerEntry : counts.entrySet()) {
			sum += visualCodeShapePositionIntegerEntry.getValue();
		}

		int offset = (percent * sum) / (100 * counts.size());

		int average = sum / counts.size();

		int minLimit = average - offset;
		int maxLimit = average + offset;

		for (Map.Entry<VisualCodeShapePosition, Integer> type : counts.entrySet()) {
			Integer count = type.getValue();

			assertTrue(minLimit < count && count < maxLimit);
		}

	}

	public void assertUniformForegroundColorDistribution() {
		assertUniformColorDistribution(foregroundColors);
	}

	public void assertUniformBackgroundColorDistribution() {
		assertUniformColorDistribution(backgroundColors);
	}

	private void assertUniformColorDistribution(Map<VisualCodeColor, Integer> colors) {
		assertEquals(colors.size(), VisualCodeColor.values().length);

		int sum = 0;
		for (Map.Entry<VisualCodeColor, Integer> type : colors.entrySet()) {
			sum += type.getValue();
		}

		int offset = (percent * sum) / (100 * colors.size());

		int average = sum / colors.size();

		int minLimit = average - offset;
		int maxLimit = average + offset;

		for (Map.Entry<VisualCodeColor, Integer> type : colors.entrySet()) {
			Integer count = type.getValue();

			assertTrue(minLimit < count && count < maxLimit);
		}

	}

	public void assertUniformBackgroundPatternDistribution() {
		assertEquals(backgroundPatterns.size(), VisualCodePatternType.values().length);

		int sum = 0;
		for (Map.Entry<VisualCodePatternType, Integer> type : backgroundPatterns.entrySet()) {
			sum += type.getValue();
		}

		int offset = (percent * sum) / (100 * backgroundPatterns.size());

		int average = sum / backgroundPatterns.size();

		int minLimit = average - offset;
		int maxLimit = average + offset;

		for (Map.Entry<VisualCodePatternType, Integer> type : backgroundPatterns.entrySet()) {
			Integer count = type.getValue();

			assertTrue(minLimit < count && count < maxLimit);
		}

	}

}
