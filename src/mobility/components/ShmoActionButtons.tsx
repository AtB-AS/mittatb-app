import {useAuthContext} from '@atb/auth';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo.tsx';

export const ShmoActionButton = () => {
  const {authenticationType} = useAuthContext();

  const {hasBlockers} = useShmoRequirements();

  const {t} = useTranslation();

  if (authenticationType != 'phone') {
    return (
      <ButtonInfoTextCombo
        onPress={() => {
          //console.log('ButtonPress');
        }}
        buttonText={t(MobilityTexts.shmoRequirements.loginBlocker)}
        message={t(MobilityTexts.shmoRequirements.loginBlockerInfoMessage)}
      />
    );
  }

  if (hasBlockers) {
    return (
      <ButtonInfoTextCombo
        onPress={() => {
          //console.log('ButtonPress');
        }}
        buttonText={t(MobilityTexts.shmoRequirements.shmoBlockers)}
        message={t(MobilityTexts.shmoRequirements.shmoBlockersInfoMessage)}
      />
    );
  }

  return null;
};
