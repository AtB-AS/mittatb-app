import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_PRODUCT,
  TEST_SELECTION,
  TEST_USER_PROFILE,
} from './test-utils';
import {PurchaseSelectionType} from '../types';

describe('purchaseSelectionBuilder - userProfiles', () => {
  it('Should apply valid user profiles', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .userProfiles([
        {...TEST_USER_PROFILE, id: 'UP2', count: 2},
        {...TEST_USER_PROFILE, id: 'UP3', count: 1},
      ])
      .build();

    expect(selection.userProfilesWithCount).toHaveLength(2);
    expect(
      selection.userProfilesWithCount.find((u) => u.id === 'UP2')?.count,
    ).toBe(2);
    expect(
      selection.userProfilesWithCount.find((u) => u.id === 'UP3')?.count,
    ).toBe(1);
  });

  it('Should not apply user profiles with zero count', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .userProfiles([
        {...TEST_USER_PROFILE, id: 'UP2', count: 2},
        {...TEST_USER_PROFILE, id: 'UP3', count: 0},
        {...TEST_USER_PROFILE, id: 'UP4', count: 1},
        {...TEST_USER_PROFILE, id: 'UP5', count: 0},
      ])
      .build();

    expect(selection.userProfilesWithCount).toHaveLength(2);
    expect(
      selection.userProfilesWithCount.find((u) => u.id === 'UP2')?.count,
    ).toBe(2);
    expect(
      selection.userProfilesWithCount.find((u) => u.id === 'UP4')?.count,
    ).toBe(1);
  });

  it('Should not apply user profiles where all has zero count', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .userProfiles([
        {...TEST_USER_PROFILE, id: 'UP2', count: 0},
        {...TEST_USER_PROFILE, id: 'UP3', count: 0},
        {...TEST_USER_PROFILE, id: 'UP4', count: 0},
        {...TEST_USER_PROFILE, id: 'UP5', count: 0},
      ])
      .build();

    expect(selection).toBe(TEST_SELECTION);
  });

  it('Should not apply user profiles where some is not in product limitations', () => {
    const originalSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          userProfileRefs: ['UP1', 'UP2'],
        },
      },
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(originalSelection)
      .userProfiles([
        {...TEST_USER_PROFILE, id: 'UP2', count: 2},
        {...TEST_USER_PROFILE, id: 'UP3', count: 1},
      ])
      .build();

    expect(selection).toBe(originalSelection);
  });
});
