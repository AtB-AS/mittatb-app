import {humanizePaymentTypeString} from '@atb/modules/ticketing';
import {
  FareContractType,
  FareContractState,
  formatNumberToString,
} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {fullDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {hasShmoBookingId} from '../utils';

type OrderDetailsSectionItemProps = {
  fareContract: FareContractType;
};

export const OrderDetailsSectionItem = ({
  fareContract,
  ...props
}: SectionItemProps<OrderDetailsSectionItemProps>) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const firstTravelRight = fareContract.travelRights[0];
  const priceString = !!fareContract.totalAmount
    ? formatNumberToString(parseFloat(fareContract.totalAmount), language)
    : undefined;
  const {topContainer} = useSectionItem(props);

  return (
    <View style={[topContainer, styles.container]} accessible={true}>
      {!hasShmoBookingId(fareContract) && (
        <ThemeText typography="body__s" color="secondary">
          {t(
            FareContractTexts.details.purchaseTime(
              fullDateTime(
                fromUnixTime(fareContract.created.getTime() / 1000),
                language,
              ),
            ),
          )}
        </ThemeText>
      )}

      <ThemeText typography="body__s" color="secondary">
        {hasShmoBookingId(fareContract)
          ? t(
              FareContractTexts.shmoDetails.tripStarted(
                fullDateTime(firstTravelRight.startDateTime, language),
              ),
            )
          : t(
              FareContractTexts.details.validFrom(
                fullDateTime(firstTravelRight.startDateTime, language),
              ),
            )}
      </ThemeText>

      <ThemeText typography="body__s" color="secondary">
        {hasShmoBookingId(fareContract)
          ? t(
              FareContractTexts.shmoDetails.tripEnded(
                fullDateTime(firstTravelRight.endDateTime, language),
              ),
            )
          : t(
              FareContractTexts.details.validTo(
                fullDateTime(firstTravelRight.endDateTime, language),
              ),
            )}
      </ThemeText>

      {fareContract.state !== FareContractState.Refunded && priceString && (
        <ThemeText typography="body__s" color="secondary">
          {t(FareContractTexts.details.totalPrice(priceString))}
        </ThemeText>
      )}

      {!!fareContract.paymentType.length &&
        fareContract.state !== FareContractState.Refunded && (
          <ThemeText typography="body__s" color="secondary">
            {t(FareContractTexts.details.paymentMethod)}
            {fareContract.paymentType.map(humanizePaymentTypeString).join(', ')}
          </ThemeText>
        )}
      {hasShmoBookingId(fareContract) && (
        <ThemeText typography="body__s" color="secondary">
          {t(FareContractTexts.details.bookingId(fareContract.bookingId ?? ''))}
        </ThemeText>
      )}
      {fareContract.orderId && (
        <ThemeText>
          {t(FareContractTexts.details.orderId(fareContract.orderId))}
        </ThemeText>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.xSmall,
  },
}));
