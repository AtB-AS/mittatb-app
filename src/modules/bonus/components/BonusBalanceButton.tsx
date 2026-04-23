import React from 'react';
import {Button} from '@atb/components/button';
import {useThemeContext} from '@atb/theme';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {useBonusBalanceQuery} from '../queries';
import {useIsBonusActiveForUser} from '../use-is-bonus-active-for-user';
import {BonusStarFill} from './BonusStarFill';

type BonusBalanceButtonProps = {
  onPress: () => void;
};

export const BonusBalanceButton = ({onPress}: BonusBalanceButtonProps) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const {data: bonusBalance} = useBonusBalanceQuery();

  if (!isBonusActiveForUser || bonusBalance == null) return null;

  return (
    <Button
      onPress={onPress}
      text={`${bonusBalance} ${t(BonusProgramTexts.bonusProfile.header.title)}`}
      type="large"
      expanded={false}
      interactiveColor={theme.color.interactive[2]}
      leftIcon={{svg: BonusStarFill}}
      hasShadow={true}
      accessibilityLabel={t(
        BonusProgramTexts.yourBonusBalanceA11yLabel(bonusBalance),
      )}
    />
  );
};
