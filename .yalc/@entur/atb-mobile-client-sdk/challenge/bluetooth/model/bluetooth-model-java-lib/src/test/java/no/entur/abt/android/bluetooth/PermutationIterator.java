package no.entur.abt.android.bluetooth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

/**
 *
 * Iterator over all possible sequences (order) from a given input list.
 *
 */

public class PermutationIterator<T> implements Iterator<List<T>> {

	// from
	// https://github.com/skjolber/3d-bin-container-packing/blob/master/core/src/main/java/com/github/skjolber/packing/impl/DefaultPermutationRotationIterator.java

	protected List<T> content;
	protected int[] permutations;
	protected boolean next = true;

	public PermutationIterator(List<T> content) {
		this.content = content;
		permutations = new int[content.size()];
		for (int i = 0; i < content.size(); i++) {
			permutations[i] = i;
		}
	}

	protected int nextPermutation() {
		// Find longest non-increasing suffix
		int i = permutations.length - 1;
		while (i > 0 && permutations[i - 1] >= permutations[i])
			i--;
		// Now i is the head index of the suffix

		// Are we at the last permutation already?
		if (i <= 0) {
			return -1;
		}

		// Let array[i - 1] be the pivot
		// Find rightmost element that exceeds the pivot
		int j = permutations.length - 1;
		while (permutations[j] <= permutations[i - 1])
			j--;
		// Now the value array[j] will become the new pivot
		// Assertion: j >= i

		int head = i - 1;

		// Swap the pivot with j
		int temp = permutations[i - 1];
		permutations[i - 1] = permutations[j];
		permutations[j] = temp;

		// Reverse the suffix
		j = permutations.length - 1;
		while (i < j) {
			temp = permutations[i];
			permutations[i] = permutations[j];
			permutations[j] = temp;
			i++;
			j--;
		}

		// Successfully computed the next permutation
		return head;
	}

	@Override
	public boolean hasNext() {
		return next;
	}

	@Override
	public List<T> next() {
		List<T> result = new ArrayList<>();
		for (int i = 0; i < permutations.length; i++) {
			result.add(content.get(permutations[i]));
		}
		next = nextPermutation() != -1;
		return result;
	}

	@Override
	public String toString() {
		return "PermutationIterator{" + Arrays.toString(permutations) + '}';
	}
}
