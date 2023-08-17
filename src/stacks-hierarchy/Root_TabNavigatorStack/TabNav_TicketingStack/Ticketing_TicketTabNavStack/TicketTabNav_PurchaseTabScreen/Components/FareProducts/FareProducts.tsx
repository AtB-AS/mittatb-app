import React from 'react';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {isProductSellableInApp} from '@atb/reference-data/utils';
import {FareProductTypeConfig} from '@atb/configuration';
import {useTicketingState} from '@atb/ticketing';
import {FareProductGroup} from './FareProductGroup';
import {ProductTypeTransportModes} from '@atb-as/config-specs';

export const FareProducts = ({
  onProductSelect,
}: {
  onProductSelect: (config: FareProductTypeConfig) => void;
}) => {
  const {preassignedFareProducts, fareProductTypeConfigs, fareProductGroups} =
    useFirestoreConfiguration();

  const {customerProfile} = useTicketingState();

  const sellableProductsInApp = preassignedFareProducts.filter((product) =>
    isProductSellableInApp(product, customerProfile),
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  type GroupedFareProducts = {
    transportModes: ProductTypeTransportModes[];
    fareProducts: FareProductTypeConfig[];
  };

  const groupedFareProducts: GroupedFareProducts[] = fareProductGroups.map(
    (group) => ({
      transportModes: group.transportModes,
      fareProducts:
        sellableFareProductTypeConfigs.filter((fareProduct) =>
          group.types.includes(fareProduct.type),
        ) ?? [],
    }),
  );

  return groupedFareProducts.map((group) => (
    <FareProductGroup
      key={group.transportModes.map((m) => m.mode).join('-')}
      transportModes={group.transportModes}
      fareProducts={group.fareProducts}
      onProductSelect={onProductSelect}
    />
  ));
};
