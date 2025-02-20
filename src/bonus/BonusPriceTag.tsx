import React, {ComponentProps} from 'react';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';

type Props = ComponentProps<typeof View> & {
  price: number;
};
export const BonusPriceTag = ({price, ...props}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View {...props} style={[styles.container, props.style]}>
      <ThemeText>{price}</ThemeText>
      <ThemeIcon
        svg={StarFill}
        size="small"
        accessibilityHint={t(BonusProgramTexts.bonuspoints)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    borderColor: theme.color.foreground.inverse.secondary,
    borderWidth: theme.border.width.slim,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
    paddingVertical: theme.spacing.xSmall,
    paddingHorizontal: theme.spacing.small,
  },
}));
