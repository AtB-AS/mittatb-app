import {View} from 'react-native';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import ThemeText from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import FareProductTile from '@atb/screens/Ticketing/FareProducts/AvailableFareProducts/FareProductTile';
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';

export const AvailableFareProducts = ({
  onProductSelect,
}: {
  onProductSelect: (config: FareProductTypeConfig) => void;
}) => {
  const styles = useStyles();
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();
  const {t} = useTranslation();

  const sellableProductsInApp = preassignedFareProducts.filter(
    productIsSellableInApp,
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  /*
  Group by two and two, as two fare products are shown side by side on each row
  in the purchase tab.
   */
  const groupedConfigs = sellableFareProductTypeConfigs.reduce<
    [FareProductTypeConfig, FareProductTypeConfig | undefined][]
  >((grouped, current, index, arr) => {
    if (index % 2 === 0) return [...grouped, [current, arr[index + 1]]];
    return grouped;
  }, []);

  return (
    <View style={styles.container}>
      <ThemeText type="body__secondary" style={styles.heading}>
        {t(TicketingTexts.availableFareProducts.allTickets)}
      </ThemeText>

      {groupedConfigs.map(([firstConfig, secondConfig]) => (
        <View style={styles.fareProductsContainer}>
          <FareProductTile
            onPress={() => onProductSelect(firstConfig)}
            testID="singleFareProduct"
            config={firstConfig}
          />
          {secondConfig && (
            <FareProductTile
              onPress={() => onProductSelect(secondConfig)}
              testID="singleFareProduct"
              config={secondConfig}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingBottom: theme.spacings.medium,
  },
  heading: {
    margin: theme.spacings.medium,
    marginLeft: theme.spacings.xLarge,
    marginTop: theme.spacings.xLarge,
  },
  fareProductsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    alignItems: 'stretch',
  },
}));
