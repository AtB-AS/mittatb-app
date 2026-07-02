import {useBonusBalanceQuery, BonusProductTypeEnum} from '@atb/modules/bonus';
import {Checkbox} from '@atb/components/checkbox';
import {
  GenericClickableSectionItem,
  GenericSectionItem,
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
import {Pressable, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {isDefined} from '@atb/utils/presence';
import {BonusStarFill} from './BonusStarFill';
import {ThemeIcon} from '@atb/components/theme-icon';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useAnalyticsContext} from '@atb/modules/analytics';

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
  const {logEvent} = useAnalyticsContext();

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  const isError =
    !isDefined(userBonusBalance) ||
    Number.isNaN(userBonusBalance) ||
    userBonusBalanceStatus === 'error';

  const hasInsufficientBalance =
    !isError && userBonusBalance < bonusProduct.price.amount;

  const a11yLabel =
    t(BonusProgramTexts.costA11yLabel(bonusProduct.price.amount)) +
    screenReaderPause +
    (getTextForLanguage(bonusProduct.paymentDescription, language) ?? '') +
    screenReaderPause +
    t(
      BonusProgramTexts.yourBonusBalanceA11yLabel(
        userBonusBalance && userBonusBalanceStatus === 'success'
          ? userBonusBalance
          : null,
      ),
    );

  const logCheckboxEvent = (
    hasSufficientBalance: boolean,
    newState?: boolean,
  ) => {
    logEvent('Bonus', 'bonus points checkbox toggled', {
      bonusProductId: bonusProduct.id,
      hasSufficientBalance,
      ...(newState !== undefined && {newState}),
    });
  };

  const content = (
    <View style={styles.container}>
      {!hasInsufficientBalance && <Checkbox checked={isChecked} />}
      <View style={styles.textContainer}>
        <View style={styles.horizontalRow}>
          <ThemeText>{t(BonusProgramTexts.spend)}</ThemeText>
          <ThemeIcon svg={BonusStarFill} size="small" />
          <ThemeText>
            {t(BonusProgramTexts.amountPoints(bonusProduct.price.amount))}
          </ThemeText>
        </View>

        <ThemeText type="secondary" style={styles.horizontalRow}>
          {getTextForLanguage(bonusProduct.paymentDescription, language) ?? ''}
        </ThemeText>

        {hasInsufficientBalance && (
          <MessageInfoText
            type="info"
            message={t(BonusProgramTexts.notEnoughPoints)}
          />
        )}
      </View>
    </View>
  );

  return (
    <>
      <Section {...props}>
        {hasInsufficientBalance ? (
          <GenericSectionItem>
            <View style={{flex: 1}}>
              {content}
              <Pressable
                onPress={() => logCheckboxEvent(false)}
                accessible={false}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </View>
          </GenericSectionItem>
        ) : (
          <GenericClickableSectionItem
            active={isChecked}
            onPress={() => {
              logCheckboxEvent(true, !isChecked);
              onPress();
            }}
            disabled={isError}
            accessibilityRole="checkbox"
            accessibilityState={{checked: isChecked}}
            accessibilityLabel={a11yLabel}
          >
            {content}
          </GenericClickableSectionItem>
        )}
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
          <MessageInfoText
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
