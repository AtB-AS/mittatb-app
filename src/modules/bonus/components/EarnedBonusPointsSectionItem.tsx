import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';

type Props = SectionItemProps<{
  amount: number;
}>;

export const EarnedBonusPointsSectionItem = ({amount, ...props}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();

  return (
    <LinkSectionItem
      {...props}
      isMarkdown={true}
      leftIcon={{svg: StarFill}}
      text={t(BonusProgramTexts.fareContract.youEarned(amount))}
      onPress={() => {
        navigation.navigate('Root_TabNavigatorStack', {
          screen: 'TabNav_ProfileStack',
          params: {
            screen: 'Profile_BonusScreen',
          },
        });
      }}
    />
  );
};
