import React, {ComponentProps} from 'react';
import {BonusPriceTag} from '@atb/bonus';
import {Checkbox} from '@atb/components/checkbox';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {GenericSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {BonusProductType} from '@atb/configuration/types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';

type Props = ComponentProps<typeof View> & {
  userBonusPoints: number;
  bonusProduct: BonusProductType;
  isChecked: boolean;
  onPress: () => void;
};

export const PayWithBonusPointsCheckbox = ({
  userBonusPoints,
  bonusProduct,
  isChecked,
  onPress,
  ...props
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const background = theme.color.background.neutral[0].background;
  const selectedBackground = theme.color.interactive[2].active.background;
  const selectedBorder = theme.color.background.accent[3].background;

  const disabled = userBonusPoints < bonusProduct.price.amount;

  return (
    <GenericSectionItem
      style={[
        props.style,
        styles.sectionItem,
        {
          backgroundColor: isChecked ? selectedBackground : background,
          borderColor: isChecked ? selectedBorder : background,
        },
      ]}
    >
      <PressableOpacity
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t(BonusProgramTexts.checkbox.a11yLabel)}
        accessibilityHint={t(BonusProgramTexts.checkbox.a11yHint)}
        disabled={disabled}
        style={[styles.container, disabled && {opacity: 0.5}]}
      >
        <Checkbox checked={isChecked} />
        <View style={styles.textContainer}>
          <ThemeText>
            {getTextForLanguage(bonusProduct.paymentDescription, language) ??
              ''}
          </ThemeText>
          <View style={styles.currentPointsRow}>
            <ThemeText typography="body__secondary" color="secondary">
              {t(BonusProgramTexts.youHave) + userBonusPoints}
            </ThemeText>
            <ThemeIcon
              color={theme.color.foreground.dynamic.secondary}
              svg={StarFill}
              size="small"
              accessibilityHint={t(BonusProgramTexts.bonuspoints)}
            />
          </View>
        </View>
        <BonusPriceTag
          price={bonusProduct.price.amount}
          style={{alignSelf: 'flex-start'}}
        />
      </PressableOpacity>
    </GenericSectionItem>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionItem: {
    borderWidth: 1,
    borderRadius: theme.border.radius.regular,
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  currentPointsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
  textContainer: {flex: 1},
}));
