import {BonusPriceTag, useBonusBalanceQuery} from '@atb/modules/bonus';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  Section,
  SectionProps,
} from '@atb/components/sections';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {BonusProductType} from '@atb/modules/configuration';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {UserBonusBalance} from './UserBonusBalance';
import {isDefined} from '@atb/utils/presence';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';

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
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {logEvent} = useBottomSheetContext();

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  const isError =
    !isDefined(userBonusBalance) ||
    Number.isNaN(userBonusBalance) ||
    userBonusBalanceStatus === 'error';

  const isDisabled = isError || userBonusBalance < bonusProduct.price.amount;

  const a11yLabel =
    (getTextForLanguage(bonusProduct.paymentDescription, language) ?? '') +
    screenReaderPause +
    t(BonusProgramTexts.costA11yLabel(bonusProduct.price.amount)) +
    screenReaderPause +
    t(
      BonusProgramTexts.yourBonusBalanceA11yLabel(
        userBonusBalance && userBonusBalanceStatus === 'success'
          ? userBonusBalance
          : null,
      ),
    );

  const onPressWithLogging = () => {
    onPress();
    logEvent('Bonus', 'bonus points checkbox toggled', {
      bonusProductId: bonusProduct.id,
      newState: isChecked,
    });
  };

  return (
    <>
      <Section {...props}>
        <GenericClickableSectionItem
          active={isChecked}
          onPress={onPressWithLogging}
          disabled={isDisabled}
          accessibilityRole="checkbox"
          accessibilityState={{checked: isChecked}}
          accessibilityLabel={a11yLabel}
        >
          <View style={styles.container}>
            <Checkbox checked={isChecked} />
            <View style={styles.textContainer}>
              <ThemeText>
                {getTextForLanguage(
                  bonusProduct.paymentDescription,
                  language,
                ) ?? ''}
              </ThemeText>
              <View style={styles.currentPointsRow}>
                <ThemeText typography="body__secondary" color="secondary">
                  {t(BonusProgramTexts.youHave)}
                </ThemeText>
                <UserBonusBalance
                  typography="body__secondary"
                  color={theme.color.foreground.dynamic.secondary}
                />
                <ThemeText typography="body__secondary" color="secondary">
                  {t(BonusProgramTexts.points)}
                </ThemeText>
              </View>
            </View>
            <BonusPriceTag
              amount={bonusProduct.price.amount}
              style={{alignSelf: 'flex-start'}}
            />
          </View>
        </GenericClickableSectionItem>
      </Section>
      {isError && (
        <MessageInfoBox
          style={styles.errorMessage}
          type="error"
          message={t(BonusProgramTexts.bonusProfile.noBonusBalance)}
        />
      )}
    </>
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
  errorMessage: {
    marginTop: theme.spacing.medium,
  },
}));
