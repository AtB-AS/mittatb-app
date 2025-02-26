import React from 'react';
import {OnboardingScreenComponent} from '@atb/onboarding';
import {MyLocation} from '@atb/assets/svg/color/images';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';

export type PaymentBlockerProps = {};

export const PaymentBlocker = ({}: PaymentBlockerProps) => {
  const {t} = useTranslation();

  return (
    <OnboardingScreenComponent
      illustration={
        //Updating in another issue
        <MyLocation height={220} />
      }
      title={t(MobilityTexts.shmoRequirements.payment.paymentTitle)}
      description={t(MobilityTexts.shmoRequirements.payment.paymentDescription)}
      buttonText={t(MobilityTexts.shmoRequirements.payment.paymentButton)}
      buttonOnPress={() => {
        //coming in another issue
      }}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
