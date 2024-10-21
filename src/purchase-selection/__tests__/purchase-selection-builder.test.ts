import {createEmptyBuilder} from '@atb/purchase-selection/purchase-selection-builder.ts';
import {PurchaseSelectionBuilderInput} from '@atb/purchase-selection/types.ts';

const DEFAULT_INPUT = {} as PurchaseSelectionBuilderInput;

/*
Really simplified example of how tests can look.
 */
describe('purchaseSelectionBuilder', () => {
  it('Selected zone is the first one if no zone specified as default', () => {
    const input = {
      ...DEFAULT_INPUT,
      tariffZones: [{id: 'A'}, {id: 'B'}, {id: 'C'}],
    } as PurchaseSelectionBuilderInput;

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.fromPlace.id).toBe('A');
  });

  it('Selected zone is the zone specified as default', () => {
    const input = {
      ...DEFAULT_INPUT,
      tariffZones: [{id: 'A'}, {id: 'B', isDefault: true}, {id: 'C'}],
    } as PurchaseSelectionBuilderInput;

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.fromPlace.id).toBe('B');
  });
});
