import {useAuthContext} from '@atb/auth';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo';

type ShmoActionButtonProps = {
  onLogin: () => void;
};

export const ShmoActionButton = ({onLogin}: ShmoActionButtonProps) => {
  const {authenticationType} = useAuthContext();
  const {hasBlockers} = useShmoRequirements();
  const {t} = useTranslation();

  if (authenticationType != 'phone') {
    return (
      <ButtonInfoTextCombo
        onPress={onLogin}
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
