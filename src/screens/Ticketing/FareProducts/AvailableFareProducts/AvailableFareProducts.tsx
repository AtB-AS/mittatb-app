import {View} from 'react-native';
import {TicketingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import ThemeText from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import FareProductTile from '@atb/screens/Ticketing/FareProducts/AvailableFareProducts/FareProductTile';

export const AvailableFareProducts = ({
  onBuySingleFareProduct,
  onBuyPeriodFareProduct,
  onBuyHour24FareProduct,
}: {
  onBuySingleFareProduct: () => void;
  onBuyPeriodFareProduct: () => void;
  onBuyHour24FareProduct: () => void;
}) => {
  const styles = useStyles();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {t} = useTranslation();

  const shouldShowSingleFareProduct = preassignedFareProducts
    .filter(productIsSellableInApp)
    .some((product) => {
      return product.type === 'single';
    });

  const shouldShowPeriodFareProduct =
    hasEnabledMobileToken &&
    preassignedFareProducts.filter(productIsSellableInApp).some((product) => {
      return product.type === 'period';
    });

  const shouldShowHour24FareProduct = preassignedFareProducts
    .filter(productIsSellableInApp)
    .some((product) => product.type === 'hour24');

  const shouldShowSummerPass = false;

  return (
    <View>
      <ThemeText type="body__secondary" style={styles.heading}>
        {t(TicketingTexts.availableFareProducts.allTickets)}
      </ThemeText>

      <View style={styles.fareProductsContainer}>
        {shouldShowSingleFareProduct && (
          <FareProductTile
            transportationModeTexts={t(
              TicketingTexts.availableFareProducts.single.transportModes,
            )}
            illustration="Single"
            onPress={onBuySingleFareProduct}
            testID="singleFareProduct"
            type={'single'}
          />
        )}
        {shouldShowPeriodFareProduct && (
          <FareProductTile
            transportationModeTexts={t(
              TicketingTexts.availableFareProducts.period.transportModes,
            )}
            illustration="Period"
            onPress={onBuyPeriodFareProduct}
            testID="periodicFareProduct"
            type={'period'}
          />
        )}
      </View>
      {shouldShowHour24FareProduct && (
        <View style={styles.fareProductsContainer}>
          <FareProductTile
            transportationModeTexts={t(
              TicketingTexts.availableFareProducts.hour24.transportModes,
            )}
            illustration="H24"
            onPress={onBuyHour24FareProduct}
            testID="24HourFareProduct"
            type={'hour24'}
          />
        </View>
      )}
      {shouldShowSummerPass && (
        <View style={styles.fareProductsContainer}>
          <FareProductTile
            transportationModeTexts={t(
              TicketingTexts.availableFareProducts.summerPass.transportModes,
            )}
            illustration="Summer"
            accented={true}
            onPress={onBuyPeriodFareProduct}
            testID="summerFareProduct"
            type={'summerPass'}
          />
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
