import {
  FareContract,
  FareContractState,
  humanizePaymentTypeString,
  isNormalTravelRight,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {fullDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {formatDecimalNumber} from '@atb/utils/numbers';

export const OrderDetails = ({fareContract}: {fareContract: FareContract}) => {
  const style = useStyles();
  const {t, language} = useTranslation();
  const orderIdText = t(
    FareContractTexts.details.orderId(fareContract.orderId),
  );
  const firstTravelRight = fareContract.travelRights[0];
  const priceString = fareContract.totalAmount
    ? formatDecimalNumber(parseFloat(fareContract.totalAmount), language, 2)
    : undefined;

  return (
    <View accessible={true}>
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
      {isNormalTravelRight(firstTravelRight) && (
        <>
          <ThemeText
            typography="body__secondary"
            color="secondary"
            style={style.marginTop}
          >
            {t(
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
            {t(
              FareContractTexts.details.validTo(
                fullDateTime(firstTravelRight.endDateTime, language),
              ),
            )}
          </ThemeText>
        </>
      )}
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
          {fareContract.paymentType?.map(humanizePaymentTypeString).join(', ')}
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
