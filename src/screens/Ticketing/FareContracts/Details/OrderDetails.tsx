import {FareContract, isPreActivatedTravelRight} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {fullDateTime} from '@atb/utils/date';
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
  const firstTravelRight = fareContract.travelRights[0];
  return (
    <View accessible={true}>
      <ThemeText type="body__secondary" color="secondary">
        {t(
          FareContractTexts.details.purchaseTime(
            fullDateTime(
              fromUnixTime(fareContract.created.toMillis() / 1000),
              language,
            ),
          ),
        )}
      </ThemeText>
      {isPreActivatedTravelRight(firstTravelRight) && (
        <>
          <ThemeText
            type="body__secondary"
            color="secondary"
            style={style.marginTop}
          >
            {t(
              FareContractTexts.details.validFrom(
                fullDateTime(firstTravelRight.startDateTime.toDate(), language),
              ),
            )}
          </ThemeText>
          <ThemeText
            type="body__secondary"
            color="secondary"
            style={style.marginTop}
          >
            {t(
              FareContractTexts.details.validTo(
                fullDateTime(firstTravelRight.endDateTime.toDate(), language),
              ),
            )}
          </ThemeText>
        </>
      )}
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
