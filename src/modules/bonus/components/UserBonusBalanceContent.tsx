import {StyleSheet, useThemeContext} from '@atb/theme';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {useFontScale} from '@atb/utils/use-font-scale';
import {useBonusBalanceQuery} from '../queries';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {UserBonusBalance} from './UserBonusBalance';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {ThemeText} from '@atb/components/text';
import {ThemedBonusBagHug} from '@atb/theme/ThemedAssets';

export function UserBonusBalanceContent(): React.JSX.Element {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const fontScale = useFontScale();
  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  return (
    <View style={styles.horizontalContainer}>
      <View
        accessible
        accessibilityLabel={t(
          BonusProgramTexts.yourBonusBalanceA11yLabel(
            userBonusBalance && userBonusBalanceStatus === 'success'
              ? userBonusBalance
              : null,
          ),
        )}
      >
        <View style={styles.currentBalanceDisplay}>
          <ThemeIcon
            color={theme.color.foreground.dynamic.primary}
            svg={StarFill}
            size="large"
          />
          <UserBonusBalance
            typography="heading__3xl"
            color={theme.color.foreground.dynamic.primary}
          />
        </View>

        <ThemeText typography="body__s" color="secondary">
          {t(BonusProgramTexts.bonusProfile.yourBonusPoints)}
        </ThemeText>
      </View>
      <ThemedBonusBagHug height={fontScale * 61} width={fontScale * 61} />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
    flex: 1,
  },
  currentBalanceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    minHeight: theme.typography['heading__xl'].lineHeight,
  },
}));
