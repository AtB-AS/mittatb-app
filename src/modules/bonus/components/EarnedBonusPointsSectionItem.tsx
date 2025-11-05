import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useFontScale} from '@atb/utils/use-font-scale';
import {Tag} from '@atb/components/tag';
import {TagInfoTexts} from '@atb/translations/components/TagInfo';
import {ThemedBonusBagHug} from '@atb/theme/ThemedAssets';

type Props = SectionItemProps<{
  amount: number;
}>;

export const EarnedBonusPointsSectionItem = ({amount, ...props}: Props) => {
  const {topContainer} = useSectionItem(props);
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();

  return (
    <View style={topContainer} accessible={true}>
      <BorderedInfoBox
        backgroundColor={theme.color.background.neutral[0]}
        type="large"
        style={styles.borderedInfoBox}
      >
        <View style={styles.leftContainer}>
          <ThemedBonusBagHug height={fontScale * 24} width={fontScale * 24} />

          <View style={styles.textContainer}>
            <ThemeText typography="body__xs">
              {t(BonusProgramTexts.fareContract.youEarned.intro)}
              <ThemeText typography="heading__xs">
                {t(BonusProgramTexts.fareContract.youEarned.earned(amount))}
              </ThemeText>
              {t(BonusProgramTexts.fareContract.youEarned.ending)}
            </ThemeText>
          </View>
        </View>
        <Tag
          a11yLabel={t(TagInfoTexts.labels.new.a11y)}
          labels={[t(TagInfoTexts.labels.new.text)]}
          tagType="primary"
        />
      </BorderedInfoBox>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    borderedInfoBox: {
      flexDirection: 'row',
      gap: theme.spacing.small,
      alignItems: 'center',
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: theme.spacing.small,
    },
    textContainer: {flex: 1},
  };
});
