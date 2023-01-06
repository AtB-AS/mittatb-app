import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';
import {TariffZoneWithMetadata} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {UserProfileWithCount} from '@atb/screens/Ticketing/Purchase/Travellers/use-user-count-state';
import {StyleSheet} from '@atb/theme';
import {
  FareContractTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {OverviewNavigationProps} from '../types';

type Props = {
  price: number;
  isLoading: boolean;
  isError: boolean;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  userProfilesWithCount: UserProfileWithCount[];
  preassignedFareProduct: PreassignedFareProduct;
  travelDate?: string;
  style?: StyleProp<ViewStyle>;
  fareProductTypeConfig: FareProductTypeConfig;
};

export default function Summary({
  price,
  isLoading,
  isError,
  fromTariffZone,
  toTariffZone,
  userProfilesWithCount,
  preassignedFareProduct,
  fareProductTypeConfig,
  travelDate,
  style,
}: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<OverviewNavigationProps>();

  const formattedPrice = formatDecimalNumber(price, language, 2);

  const hasSelection = userProfilesWithCount.some((u) => u.count);

  const toPaymentFunction = () => {
    navigation.navigate('Confirmation', {
      fareProductTypeConfig,
      fromTariffZone,
      toTariffZone,
      userProfilesWithCount,
      preassignedFareProduct,
      travelDate,
      headerLeftButton: {type: 'back'},
    });
  };

  const transportModesText = fareProductTypeConfig.transportModes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
    .filter(Boolean)
    .join('/');

  const SummaryText = () => {
    switch (fareProductTypeConfig.configuration.zoneSelectionMode) {
      case 'single':
      case 'multiple':
        return (
          <ThemeText type="body__secondary" style={styles.message}>
            {t(PurchaseOverviewTexts.summary.messageInZone)}
          </ThemeText>
        );
      case 'none':
        return (
          <ThemeText type="body__secondary" style={styles.message}>
            {t(
              PurchaseOverviewTexts.summary.messageAppliesFor(
                transportModesText,
              ),
            )}
          </ThemeText>
        );
    }
  };

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <ThemeText
            type="body__primary--bold"
            style={styles.price}
            testID="offerTotalPriceText"
          >
            {t(PurchaseOverviewTexts.summary.price(formattedPrice))}
          </ThemeText>
          <SummaryText />
        </>
      )}

      <Button
        interactiveColor="interactive_0"
        text={t(PurchaseOverviewTexts.summary.button)}
        disabled={isLoading || !hasSelection || isError}
        onPress={toPaymentFunction}
        rightIcon={{svg: ArrowRight}}
        testID="goToPaymentButton"
        style={styles.button}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  price: {
    textAlign: 'center',
  },
  message: {textAlign: 'center', marginTop: theme.spacings.medium},
  button: {marginTop: theme.spacings.xLarge},
}));
