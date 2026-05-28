import {useBonusBalanceQuery, BonusProductTypeEnum} from '@atb/modules/bonus';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  Section,
  SectionProps,
} from '@atb/components/sections';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {BonusProductType} from '@atb/modules/bonus';
import {StyleSheet} from '@atb/theme';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {isDefined} from '@atb/utils/presence';
import {BonusStarFill} from './BonusStarFill';
import {ThemeIcon} from '@atb/components/theme-icon';

type Props = SectionProps & {
  bonusProduct: BonusProductType;
  operatorName?: string;
  isChecked: boolean;
  onPress: () => void;
};

export const PayWithBonusPointsCheckbox = ({
  bonusProduct,
  operatorName,
  isChecked,
  onPress,
  ...props
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

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

  return (
    <>
      <Section {...props}>
        <GenericClickableSectionItem
          active={isChecked}
          onPress={onPress}
          disabled={isDisabled}
          accessibilityRole="checkbox"
          accessibilityState={{checked: isChecked}}
          accessibilityLabel={a11yLabel}
        >
          <View style={styles.container}>
            <Checkbox checked={isChecked} />
            <View style={styles.textContainer}>
              <View style={styles.horizontalRow}>
                <ThemeText>{t(BonusProgramTexts.spend)}</ThemeText>
                <ThemeIcon svg={BonusStarFill} size="small" />
                <ThemeText>
                  {t(BonusProgramTexts.amountPoints(bonusProduct.price.amount))}
                </ThemeText>
              </View>

              <ThemeText type="secondary" style={styles.horizontalRow}>
                {getTextForLanguage(
                  bonusProduct.paymentDescription,
                  language,
                ) ?? ''}
              </ThemeText>
            </View>
          </View>
        </GenericClickableSectionItem>
      </Section>
      {isError && (
        <MessageInfoBox
          style={styles.infoMessage}
          type="error"
          message={t(BonusProgramTexts.bonusProfile.noBonusBalance)}
        />
      )}
      {isChecked &&
        bonusProduct.productType === BonusProductTypeEnum.VOUCHER && (
          <MessageInfoBox
            style={styles.infoMessage}
            type="warning"
            message={t(
              BonusProgramTexts.log_in_operator_app_warning(operatorName ?? ''),
            )}
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
    flex: 1,
  },
  horizontalRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
  textContainer: {gap: theme.spacing.small, flex: 1},
  infoMessage: {
    marginTop: theme.spacing.medium,
  },
}));
