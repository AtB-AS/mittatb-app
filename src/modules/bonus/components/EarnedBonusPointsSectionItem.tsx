import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {useNavigateToNestedProfileScreen} from '@atb/utils/use-navigate-to-nested-profile-screen';

type Props = SectionItemProps<{
  amount: number;
}>;

export const EarnedBonusPointsSectionItem = ({amount, ...props}: Props) => {
  const {t} = useTranslation();
  const navigateToBonusScreen = useNavigateToNestedProfileScreen(
    'Profile_BonusScreen',
  );

  return (
    <LinkSectionItem
      {...props}
      isMarkdown={true}
      leftIcon={{svg: StarFill}}
      text={t(BonusProgramTexts.fareContract.youEarned(amount))}
      onPress={navigateToBonusScreen}
    />
  );
};
