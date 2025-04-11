import React from 'react';
import {OnboardingScreenComponent} from '@atb/onboarding';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {ThemedMyLocation} from '@atb/theme/ThemedAssets';

export type PaymentScreenComponentProps = {};

export const PaymentScreenComponent = ({}: PaymentScreenComponentProps) => {
  const {t} = useTranslation();

  return (
    <OnboardingScreenComponent
      illustration={
        //Updating in another issue
        <ThemedMyLocation height={220} />
      }
      title={t(MobilityTexts.shmoRequirements.payment.title)}
      description={t(MobilityTexts.shmoRequirements.payment.description)}
      buttonText={t(MobilityTexts.shmoRequirements.payment.button)}
      buttonOnPress={() => {
        //coming in another issue
      }}
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};
