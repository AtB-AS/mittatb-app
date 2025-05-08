import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {useRecurringPayment} from '@atb/ticketing/use-recurring-payment';
import {ThemedMyLocation} from '@atb/theme/ThemedAssets';

export type PaymentScreenComponentProps = {};

export const PaymentScreenComponent = ({}: PaymentScreenComponentProps) => {
  const {t} = useTranslation();
  const {onAddRecurringPayment} = useRecurringPayment();

  return (
    <OnboardingScreenComponent
      illustration={<ThemedMyLocation fontSize={220} />}
      title={t(MobilityTexts.shmoRequirements.payment.title)}
      description={t(MobilityTexts.shmoRequirements.payment.description)}
      buttonText={t(MobilityTexts.shmoRequirements.payment.button)}
      buttonOnPress={onAddRecurringPayment}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
