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

  let groupedFareProducts: GroupedFareProducts[] = fareProductGroups.reduce<
    GroupedFareProducts[]
  >(function (result, item) {
    const filteredFareProducts =
      sellableFareProductTypeConfigs.filter((fareProduct) =>
        item.types.includes(fareProduct.type),
      ) ?? [];

    if (filteredFareProducts.length > 0) {
      result.push({
        transportModes: item.transportModes,
        fareProducts: filteredFareProducts,
        heading: item.heading,
      });
    }
    return result;
  }, []);

  const otherProducts = sellableFareProductTypeConfigs.filter(
    (p) => !flatMap(groupedFareProducts, (g) => g.fareProducts).includes(p),
  );

  if (otherProducts.length > 0) {
    groupedFareProducts = [
      ...groupedFareProducts,
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
