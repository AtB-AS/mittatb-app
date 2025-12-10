import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';

type Props = SectionItemProps<{
  amount: number;
  navigateToBonusScreen: () => void;
}>;

export const EarnedBonusPointsSectionItem = ({
  amount,
  navigateToBonusScreen,
  ...props
}: Props) => {
  const {t} = useTranslation();

  return (
    <LinkSectionItem
      {...props}
      isMarkdown={true}
      leftIcon={{svg: StarFill}}
      text={t(BonusProgramTexts.fareContract.youEarned(amount))}
      accessibility={{
        accessibilityLabel: t(
          BonusProgramTexts.fareContract.youEarnedA11yLabel(amount),
        ),
      }}
      onPress={navigateToBonusScreen}
    />
  );
};
