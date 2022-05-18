import ThemeText from '@atb/components/text';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import Button from '@atb/components/button';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {useNavigation} from '@react-navigation/native';
import {OverviewNavigationProp} from '@atb/screens/Ticketing/Purchase/Overview';
import {TariffZoneWithMetadata} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {UserProfileWithCount} from '@atb/screens/Ticketing/Purchase/Travellers/use-user-count-state';
import {PreassignedFareProduct} from '@atb/reference-data/types';

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
};

export default function ({
  price,
  isLoading,
  isError,
  fromTariffZone,
  toTariffZone,
  userProfilesWithCount,
  preassignedFareProduct,
  travelDate,
  style,
}: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<OverviewNavigationProp>();

  const formattedPrice = formatDecimalNumber(price, language, 2);

  const toPaymentFunction = () => {
    navigation.navigate('Confirmation', {
      fromTariffZone,
      toTariffZone,
      userProfilesWithCount,
      preassignedFareProduct,
      travelDate,
      headerLeftButton: {type: 'back'},
    });
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
          <ThemeText type="body__secondary" style={styles.message}>
            {t(PurchaseOverviewTexts.summary.message)}
          </ThemeText>
        </>
      )}

      <Button
        interactiveColor="interactive_0"
        text={t(PurchaseOverviewTexts.summary.button)}
        disabled={isLoading || isError}
        onPress={toPaymentFunction}
        icon={ArrowRight}
        iconPosition="right"
        testID="goToPaymentButton"
        style={styles.button}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  price: {
    marginBottom: theme.spacings.medium,
    textAlign: 'center',
  },
  message: {textAlign: 'center'},
  button: {marginTop: theme.spacings.xLarge},
}));
