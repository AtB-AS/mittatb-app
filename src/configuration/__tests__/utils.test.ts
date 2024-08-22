import {PreassignedFareProduct} from '..';
import {removeProductAliasDuplicates} from '../utils';

describe('removeProductAliasDuplicates', () => {
  it('removes duplicates', () => {
    const products = [
      {productAliasId: 'id-1'},
      {productAliasId: 'id-1'},
      {productAliasId: 'id-2'},
    ] as PreassignedFareProduct[];
    const dedupedProducts = products.filter(removeProductAliasDuplicates);
    expect(dedupedProducts.length).toEqual(2);
  });

  it('does not remove undefined', () => {
    const products = [
      {productAliasId: 'id-1'},
      {productAliasId: undefined},
      {productAliasId: undefined},
    ] as PreassignedFareProduct[];
    const dedupedProducts = products.filter(removeProductAliasDuplicates);
    expect(dedupedProducts.length).toEqual(3);
  });
});
