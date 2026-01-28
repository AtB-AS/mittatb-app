import React from 'react';
import {useTicketingContext} from '@atb/modules/ticketing';
import {FareProductGroup} from './FareProductGroup';
import {
  useFirestoreConfigurationContext,
  FareProductTypeConfig,
  LanguageAndTextType,
  ProductTypeTransportModes,
  isProductSellableInApp,
  PreassignedFareProduct,
} from '@atb/modules/configuration';
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
  fareProducts,
  onProductSelect,
}: {
  fareProducts: PreassignedFareProduct[];
  onProductSelect: (config: FareProductTypeConfig) => void;
}) => {
  const {t, language} = useTranslation();
  const {fareProductTypeConfigs, fareProductGroups} =
    useFirestoreConfigurationContext();
  const {customerProfile} = useTicketingContext();

  const sellableProductsInApp = fareProducts.filter((product) =>
    isProductSellableInApp(product, customerProfile),
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) =>
      sellableProductsInApp.some(
        (p) => p.type === config.type && !p.isSupplementProduct,
      ),
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
          key={[
            group.transportModes.map((m) => m.mode).join('-'),
            group.heading?.[0]?.value,
          ].join('-')}
          transportModes={group.transportModes}
          fareProducts={group.fareProducts}
          onProductSelect={onProductSelect}
        />
      ))}
    </>
  );
};
