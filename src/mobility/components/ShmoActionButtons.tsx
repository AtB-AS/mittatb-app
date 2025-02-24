import {useAuthContext} from '@atb/auth';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo.tsx';

export const ShmoActionButtons = () => {
  const {authenticationType} = useAuthContext();

  const {blockers} = useShmoRequirements();

  const {t} = useTranslation();

  if (authenticationType != 'phone') {
    return (
      <ButtonInfoTextCombo
        onPress={() => {
          console.log('ButtonPress');
        }}
        buttonText={t(MobilityTexts.loginBlocker)}
        message={t(MobilityTexts.loginBlockerInfoMessage)}
      />
    );
  }

  // check if a user has any blockers for shmo
  if (blockers.some((blocker) => blocker.isBlocking)) {
    return (
      <ButtonInfoTextCombo
        onPress={() => {
          console.log('ButtonPress');
        }}
        buttonText={t(MobilityTexts.shmoBlockers)}
        message={t(MobilityTexts.shmoBlockersInfoMessage)}
      />
    );
  }

  return null;
};
