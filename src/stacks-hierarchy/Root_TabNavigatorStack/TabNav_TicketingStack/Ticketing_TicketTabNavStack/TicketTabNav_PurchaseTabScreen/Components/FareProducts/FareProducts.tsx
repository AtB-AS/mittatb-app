import React from 'react';
import {useTicketingState} from '@atb/ticketing';
import {FareProductGroup} from './FareProductGroup';
import {
  useFirestoreConfiguration,
  FareProductTypeConfig,
  LanguageAndTextType,
  ProductTypeTransportModes,
  isProductSellableInApp,
} from '@atb/configuration';
import {flatMap} from '@atb/utils/array';
import {
  TicketingTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';

type GroupedFareProducts = {
  transportModes: ProductTypeTransportModes[];
  fareProducts: FareProductTypeConfig[];
  heading?: LanguageAndTextType[];
};

export const FareProducts = ({
  onProductSelect,
}: {
  onProductSelect: (config: FareProductTypeConfig) => void;
}) => {
  const {t, language} = useTranslation();
  const {preassignedFareProducts, fareProductTypeConfigs, fareProductGroups} =
    useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  const sellableProductsInApp = preassignedFareProducts.filter((product) =>
    isProductSellableInApp(product, customerProfile),
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  let groupedFareProducts: GroupedFareProducts[] = fareProductGroups.map(
    (group) => ({
      transportModes: group.transportModes,
      fareProducts:
        sellableFareProductTypeConfigs.filter((fareProduct) =>
          group.types.includes(fareProduct.type),
        ) ?? [],
      heading: group.heading,
    }),
  );

  const otherProducts = sellableFareProductTypeConfigs.filter(
    (p) => !flatMap(groupedFareProducts, (g) => g.fareProducts).includes(p),
  );

  if (otherProducts.length > 0) {
    groupedFareProducts = [
      ...groupedFareProducts.filter((group) => group.fareProducts.length > 0),
      {
        transportModes: [],
        fareProducts: otherProducts,
      },
    ];
  }

  return (
    <>
      {groupedFareProducts.map((group) => (
        <FareProductGroup
          heading={
            group.heading
              ? getTextForLanguage(group.heading, language)
              : groupedFareProducts.length === 1
              ? t(TicketingTexts.availableFareProducts.allTickets)
              : undefined
          }
          key={group.transportModes.map((m) => m.mode).join('-')}
          transportModes={group.transportModes}
          fareProducts={group.fareProducts}
          onProductSelect={onProductSelect}
        />
      ))}
    </>
  );
};
