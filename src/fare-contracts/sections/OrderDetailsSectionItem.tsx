import {
  FareContract,
  FareContractState,
  humanizePaymentTypeString,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {fullDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';

type OrderDetailsSectionItemProps = {
  fareContract: FareContract;
};

export const OrderDetailsSectionItem = ({
  fareContract,
  ...props
}: SectionItemProps<OrderDetailsSectionItemProps>) => {
  const style = useStyles();
  const {t, language} = useTranslation();
  const orderIdText = t(
    FareContractTexts.details.orderId(fareContract.orderId),
  );
  const firstTravelRight = fareContract.travelRights[0];
  const priceString = formatDecimalNumber(
    parseFloat(fareContract.totalAmount),
    language,
    2,
  );
  const {topContainer} = useSectionItem(props);

  return (
    <View style={[topContainer]} accessible={true}>
      {!fareContract.bookingId && (
        <ThemeText typography="body__secondary" color="secondary">
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

      <ThemeText
        typography="body__secondary"
        color="secondary"
        style={style.marginTop}
      >
        {fareContract.bookingId
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

      <ThemeText
        typography="body__secondary"
        color="secondary"
        style={style.marginTop}
      >
        {fareContract.bookingId
          ? t(
              FareContractTexts.shmoDetails.tripEnded(
                fullDateTime(firstTravelRight.endDateTime, language),
              ),
            )
          : t(
              FareContractTexts.details.validTo(
                fullDateTime(firstTravelRight.startDateTime, language),
              ),
            )}
      </ThemeText>

      {fareContract.state !== FareContractState.Refunded && priceString && (
        <ThemeText
          typography="body__secondary"
          color="secondary"
          style={style.marginTop}
        >
          {t(FareContractTexts.details.totalPrice(priceString))}
        </ThemeText>
      )}

      {fareContract.state !== FareContractState.Refunded && (
        <ThemeText
          typography="body__secondary"
          color="secondary"
          style={style.marginTop}
        >
          {t(FareContractTexts.details.paymentMethod)}
          {fareContract.paymentType.map(humanizePaymentTypeString).join(', ')}
        </ThemeText>
      )}
      {fareContract.bookingId && (
        <ThemeText style={style.marginTop}>
          {t(
            FareContractTexts.details.bookingId(fareContract?.bookingId ?? ''),
          )}
        </ThemeText>
      )}
      <ThemeText style={style.marginTop}>{orderIdText}</ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  marginTop: {
    marginTop: theme.spacing.xSmall,
  },
}));
