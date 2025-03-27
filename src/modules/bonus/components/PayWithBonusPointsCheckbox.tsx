import {BonusPriceTag, useBonusBalanceQuery} from '@atb/modules/bonus';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  Section,
  SectionProps,
} from '@atb/components/sections';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {BonusProductType} from '@atb/configuration/types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';

type Props = SectionProps & {
  bonusProduct: BonusProductType;
  isChecked: boolean;
  onPress: () => void;
};

export const PayWithBonusPointsCheckbox = ({
  bonusProduct,
  isChecked,
  onPress,
  ...props
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();
  const disabled =
    typeof userBonusBalance != 'number' ||
    userBonusBalance < bonusProduct.price.amount;

  const a11yLabel =
    (getTextForLanguage(bonusProduct.paymentDescription, language) ?? '') +
    screenReaderPause +
    t(BonusProgramTexts.costA11yLabel(bonusProduct.price.amount)) +
    screenReaderPause +
    t(
      BonusProgramTexts.yourBonusBalanceA11yLabel(
        userBonusBalanceStatus === 'error' ? null : userBonusBalance,
      ),
    );

  return (
    <Section {...props}>
      <GenericClickableSectionItem
        active={isChecked}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{checked: isChecked}}
        accessibilityLabel={a11yLabel}
      >
        <View style={styles.container}>
          <Checkbox checked={isChecked} />
          <View style={styles.textContainer}>
            <ThemeText>
              {getTextForLanguage(bonusProduct.paymentDescription, language) ??
                ''}
            </ThemeText>
            {userBonusBalanceStatus === 'error' && (
              <MessageInfoBox
                type="error"
                message={t(BonusProgramTexts.bonusProfile.noBonusBalance)}
              />
            )}
            <View style={styles.currentPointsRow}>
              <ThemeText typography="body__secondary" color="secondary">
                {t(BonusProgramTexts.youHave)}{' '}
                {(() => {
                  switch (userBonusBalanceStatus) {
                    case 'loading':
                      return <ActivityIndicator />;
                    case 'error':
                      return '--';
                    default:
                      return userBonusBalance;
                  }
                })()}
              </ThemeText>
              <ThemeIcon
                color={theme.color.foreground.dynamic.secondary}
                svg={StarFill}
                size="small"
              />
            </View>
          </View>
          <BonusPriceTag
            amount={bonusProduct.price.amount}
            style={{alignSelf: 'flex-start'}}
          />
        </View>
      </GenericClickableSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    width: '100%',
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
