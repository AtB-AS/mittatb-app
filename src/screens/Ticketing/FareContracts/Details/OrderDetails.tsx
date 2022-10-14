import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import _ from 'lodash';
import React from 'react';
import {StyleSheet} from '@atb/theme';

const OrderDetails = ({fareContract}: {fareContract: FareContract}) => {
  const style = useStyles();
  const {t, language} = useTranslation();
  const orderIdText = t(
    FareContractTexts.details.orderId(fareContract.orderId),
  );
  return (
    <View accessible={true}>
      <ThemeText type="body__secondary" color="secondary">
        {t(
          FareContractTexts.details.purchaseTime(
            formatToLongDateTime(
              fromUnixTime(fareContract.created.toMillis() / 1000),
              language,
            ),
          ),
        )}
      </ThemeText>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={style.marginTop}
      >
        {t(FareContractTexts.details.paymentMethod)}
        {_.capitalize(fareContract?.paymentType)}
      </ThemeText>
      <ThemeText style={style.marginTop}>{orderIdText}</ThemeText>
    </View>
  );
};

export default OrderDetails;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  marginTop: {
    marginTop: theme.spacings.xSmall,
  },
}));
