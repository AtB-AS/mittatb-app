import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useFontScale} from '@atb/utils/use-font-scale';
import {LabelInfo} from '@atb/components/label-info';

type Props = SectionItemProps<{
  amount: number;
}>;

export const EarnedBonusPointsSectionItem = ({amount, ...props}: Props) => {
  const {topContainer} = useSectionItem(props);
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();

  return (
    <View style={topContainer} accessible={true}>
      <BorderedInfoBox
        backgroundColor={theme.color.background.neutral[0]}
        type="large"
        style={styles.borderedInfoBox}
      >
        <View style={styles.leftContainer}>
          <View style={styles.illustrationContainer} />
          <View style={styles.textContainer}>
            <ThemeText typography="body__tertiary" isMarkdown>
              {t(BonusProgramTexts.fareContract.youEarned(amount))}
            </ThemeText>
          </View>
        </View>
        <LabelInfo label="new" />
      </BorderedInfoBox>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const fontScale = useFontScale();
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
    },
    textContainer: {flex: 1},
    illustrationContainer: {
      height: 18 * fontScale,
      width: 28 * fontScale,
    },
  };
});
