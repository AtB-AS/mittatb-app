import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Button} from '@atb/components/button';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {useIsBonusBalanceButtonVisible} from '../use-is-bonus-balance-button-visible';
import {BonusStarFill} from './BonusStarFill';

type BonusBalanceButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const BonusBalanceButton = ({
  onPress,
  style,
}: BonusBalanceButtonProps) => {
  const {t} = useTranslation();
  const bonusInfo = useIsBonusBalanceButtonVisible();

  if (!bonusInfo.isVisible) return null;

  return (
    <Button
      onPress={onPress}
      text={`${bonusInfo.bonusBalance} ${t(BonusProgramTexts.points)}`}
      type="large"
      expanded={false}
      surfaceColor="neutral"
      leftIcon={{svg: BonusStarFill}}
      accessibilityLabel={t(
        BonusProgramTexts.yourBonusBalanceA11yLabel(bonusInfo.bonusBalance),
      )}
      style={style}
    />
  );
};
