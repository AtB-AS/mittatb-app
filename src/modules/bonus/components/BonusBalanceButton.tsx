import React from 'react';
import {Button} from '@atb/components/button';
import {useThemeContext} from '@atb/theme';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {useIsBonusBalanceButtonVisible} from '../use-is-bonus-balance-button-visible';
import {BonusStarFill} from './BonusStarFill';

type BonusBalanceButtonProps = {
  onPress: () => void;
};

export const BonusBalanceButton = ({onPress}: BonusBalanceButtonProps) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const bonusInfo = useIsBonusBalanceButtonVisible();

  if (!bonusInfo.isVisible) return null;

  return (
    <Button
      onPress={onPress}
      text={`${bonusInfo.bonusBalance} ${t(BonusProgramTexts.bonusProfile.header.title)}`}
      type="large"
      expanded={false}
      interactiveColor={theme.color.interactive[2]}
      leftIcon={{svg: BonusStarFill}}
      hasShadow={true}
      accessibilityLabel={t(
        BonusProgramTexts.yourBonusBalanceA11yLabel(bonusInfo.bonusBalance),
      )}
    />
  );
};
