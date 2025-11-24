import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_PRODUCT,
  TEST_SELECTION,
  TEST_BAGGAGE_PRODUCT,
  TEST_USER_PROFILE,
} from './test-utils';
import {PurchaseSelectionType} from '../types';
import {isSelectableSupplementProduct} from '../utils';

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

  it('Should not apply user profiles with zero count if no supplement products are selected', () => {
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

describe('isSelectableSupplementProduct', () => {
  it('returns true if supplement product is allowed by limitations', () => {
    const selection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          supplementProductRefs: ['SP1', 'SP2'],
        },
      },
    };
    const supplementProduct = {...TEST_BAGGAGE_PRODUCT, id: 'SP1'};
    expect(isSelectableSupplementProduct(selection, supplementProduct)).toBe(
      true,
    );
  });

  it('returns false if supplement product is not allowed by limitations', () => {
    const selection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          supplementProductRefs: ['SP1', 'SP2'],
        },
      },
    };
    const supplementProduct = {...TEST_BAGGAGE_PRODUCT, id: 'SP3'};
    expect(isSelectableSupplementProduct(selection, supplementProduct)).toBe(
      false,
    );
  });

  it('returns false if supplementProductRefs is empty (no limitations)', () => {
    const selection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          supplementProductRefs: [],
        },
      },
    };
    const supplementProduct = {...TEST_BAGGAGE_PRODUCT, id: 'SP3'};
    expect(isSelectableSupplementProduct(selection, supplementProduct)).toBe(
      false,
    );
  });
});

it('Should not apply supplement products with zero count', () => {
  const selection = createEmptyBuilder(TEST_INPUT)
    .fromSelection(TEST_SELECTION)
    .baggageProducts([
      {...TEST_BAGGAGE_PRODUCT, id: 'SP1', count: 0},
      {...TEST_BAGGAGE_PRODUCT, id: 'SP2', count: 3},
      {...TEST_BAGGAGE_PRODUCT, id: 'SP3', count: 0},
    ])
    .build();

  expect(selection.baggageProductsWithCount).toHaveLength(1);
  expect(selection.baggageProductsWithCount[0].id).toBe('SP2');
  expect(selection.baggageProductsWithCount[0].count).toBe(3);
});

it('Should not apply any user profiles or supplement products if all have zero count', () => {
  const selection = createEmptyBuilder(TEST_INPUT)
    .fromSelection(TEST_SELECTION)
    .userProfiles([
      {...TEST_USER_PROFILE, id: 'UP2', count: 0},
      {...TEST_USER_PROFILE, id: 'UP3', count: 0},
    ])
    .baggageProducts([
      {...TEST_BAGGAGE_PRODUCT, id: 'SP1', count: 0},
      {...TEST_BAGGAGE_PRODUCT, id: 'SP2', count: 0},
    ])
    .build();

  expect(selection.userProfilesWithCount).toHaveLength(1);
  expect(selection.baggageProductsWithCount).toHaveLength(0);
  expect(selection).toStrictEqual(TEST_SELECTION);
});

it('Should apply both user profiles and supplement products with positive count', () => {
  const selection = createEmptyBuilder(TEST_INPUT)
    .fromSelection(TEST_SELECTION)
    .userProfiles([
      {...TEST_USER_PROFILE, id: 'UP2', count: 1},
      {...TEST_USER_PROFILE, id: 'UP3', count: 2},
    ])
    .baggageProducts([
      {...TEST_BAGGAGE_PRODUCT, id: 'SP1', count: 2},
      {...TEST_BAGGAGE_PRODUCT, id: 'SP2', count: 1},
    ])
    .build();

  expect(selection.userProfilesWithCount).toHaveLength(2);
  expect(selection.baggageProductsWithCount).toHaveLength(2);
});

it('Should apply zero count user profile with existing supplement product', () => {
  const selection = createEmptyBuilder(TEST_INPUT)
    .fromSelection(TEST_SELECTION)
    .baggageProducts([{...TEST_BAGGAGE_PRODUCT, id: 'SP1', count: 2}])
    .userProfiles([{...TEST_USER_PROFILE, id: 'UP2', count: 0}])
    .build();

  expect(selection.userProfilesWithCount).toHaveLength(0);
  expect(selection.baggageProductsWithCount).toHaveLength(1);
  expect(selection.baggageProductsWithCount[0].id).toBe('SP1');
  expect(selection.baggageProductsWithCount[0].count).toBe(2);
});

it('Should apply zero count user profile with multiple supplement products', () => {
  const selection = createEmptyBuilder(TEST_INPUT)
    .fromSelection(TEST_SELECTION)
    .baggageProducts([
      {...TEST_BAGGAGE_PRODUCT, id: 'SP1', count: 2},
      {...TEST_BAGGAGE_PRODUCT, id: 'SP2', count: 1},
    ])
    .userProfiles([{...TEST_USER_PROFILE, id: 'UP2', count: 0}])
    .build();

  expect(selection.userProfilesWithCount).toHaveLength(0);
  expect(selection.baggageProductsWithCount).toHaveLength(2);
  expect(
    selection.baggageProductsWithCount.find((s) => s.id === 'SP1')?.count,
  ).toBe(2);
  expect(
    selection.baggageProductsWithCount.find((s) => s.id === 'SP2')?.count,
  ).toBe(1);
});
