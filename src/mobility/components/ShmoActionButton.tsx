import {useAuthContext} from '@atb/auth';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo.tsx';

type ShmoActionButtonProps = {
  onLogin: () => void;
  onStartOnboarding: () => void;
};

export const ShmoActionButton = ({
  onLogin,
  onStartOnboarding,
}: ShmoActionButtonProps) => {
  const {authenticationType} = useAuthContext();
  const {hasBlockers, numberOfBlockers} = useShmoRequirements();
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
        onPress={onStartOnboarding}
        buttonText={t(MobilityTexts.shmoRequirements.shmoBlockers)}
        message={t(
          MobilityTexts.shmoRequirements.shmoBlockersInfoMessage(
            numberOfBlockers,
          ),
        )}
      />
    );
  }

  return null;
};
