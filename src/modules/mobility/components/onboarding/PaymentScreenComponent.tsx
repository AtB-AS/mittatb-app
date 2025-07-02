import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {useRecurringPayment} from '@atb/modules/ticketing';
import {ThemedPaymentCard} from '@atb/theme/ThemedAssets';

export type PaymentScreenComponentProps = {};

export const PaymentScreenComponent = ({}: PaymentScreenComponentProps) => {
  const {t} = useTranslation();
  const {onAddRecurringPayment} = useRecurringPayment();

  return (
    <OnboardingScreenComponent
      illustration={<ThemedPaymentCard fontSize={220} />}
      title={t(MobilityTexts.shmoRequirements.payment.title)}
      description={t(MobilityTexts.shmoRequirements.payment.description)}
      footerButton={{
        onPress: onAddRecurringPayment,
        text: t(MobilityTexts.shmoRequirements.payment.button),
        expanded: true,
      }}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
