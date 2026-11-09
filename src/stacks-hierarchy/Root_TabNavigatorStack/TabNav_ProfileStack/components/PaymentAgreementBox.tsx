import VippsLogo from '@atb/assets/svg/color/icons/ticketing/VippsLogo';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {VIPPS_BACKGROUND_COLOR} from '@atb/components/vipps-login-button';
import {PaymentAgreement, PaymentType} from '@atb/modules/ticketing';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {formatToShortDateWithFullYear} from '@atb/utils/date';
import {useDelayGate} from '@atb/utils/use-delay-gate';
import {openUrl} from '@atb/utils/open-url';
import {View} from 'react-native';

const PENDING_PAYMENT_AGREEMENT_DELAY_MS = 300;

type Props = {
  paymentType: PaymentType;
  /** The latest active payment agreement of this payment type, if any */
  agreement: PaymentAgreement | undefined;
  /** The latest payment agreement of this payment type being created, if any */
  pendingAgreement: PaymentAgreement | undefined;
  onActivate: () => void;
  onStop: (agreement: PaymentAgreement) => void;
  isLoading: boolean;
};

/**
 * Shows how to activate a payment agreement of the given payment type, lets
 * the user complete one being created, or stop the active one.
 */
export const PaymentAgreementBox = ({
  paymentType,
  agreement,
  pendingAgreement,
  onActivate,
  onStop,
  isLoading,
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  // An active agreement wins over a pending one
  const hasOnlyPendingAgreement = !agreement && !!pendingAgreement;
  // Agreements are often activated right after returning from Vipps, so only
  // show it as pending if it stays pending for a moment, to avoid a flicker.
  const hasBeenPendingForAMoment = useDelayGate(
    PENDING_PAYMENT_AGREEMENT_DELAY_MS,
    hasOnlyPendingAgreement,
  );
  const showAsPending = hasOnlyPendingAgreement && hasBeenPendingForAMoment;
  const pendingConfirmationUrl = pendingAgreement?.confirmationUrl;

  // The texts are specific to Vipps
  if (paymentType !== PaymentType.Vipps) return null;
  const title = t(
    agreement
      ? PaymentMethodsTexts.agreements.vipps.active.title
      : showAsPending
        ? PaymentMethodsTexts.agreements.vipps.pending.title
        : PaymentMethodsTexts.agreements.vipps.inactive.title,
  );
  const description = t(
    agreement
      ? PaymentMethodsTexts.agreements.vipps.active.description
      : showAsPending
        ? PaymentMethodsTexts.agreements.vipps.pending.description
        : PaymentMethodsTexts.agreements.vipps.inactive.description,
  );

  return (
    <Section>
      <GenericSectionItem>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <VippsLogo width={107} height={28} />
          </View>
          <View style={styles.texts}>
            <ThemeText typography="heading__l">{title}</ThemeText>
            <ThemeText typography="body__m">{description}</ThemeText>
            {agreement && (
              <ThemeText typography="body__s" type="secondary">
                {t(
                  agreement.updatedAt
                    ? PaymentMethodsTexts.agreements.vipps.active.updated(
                        formatToShortDateWithFullYear(
                          agreement.updatedAt,
                          language,
                        ),
                      )
                    : PaymentMethodsTexts.agreements.vipps.active.created(
                        formatToShortDateWithFullYear(
                          agreement.createdAt,
                          language,
                        ),
                      ),
                )}
              </ThemeText>
            )}
          </View>
        </View>
      </GenericSectionItem>
      {agreement ? (
        <GenericSectionItem>
          <Button
            surfaceColor="error"
            expanded={true}
            mode="secondary"
            text={t(PaymentMethodsTexts.agreements.vipps.active.stopButton)}
            loading={isLoading}
            onPress={() => onStop(agreement)}
            testID="stopVippsAgreementButton"
          />
        </GenericSectionItem>
      ) : showAsPending ? (
        // Agreements created as part of a payment have no link to complete
        // them, so they are just shown as pending
        pendingConfirmationUrl && (
          <GenericSectionItem>
            <Button
              surfaceColor="accent"
              expanded={true}
              text={t(PaymentMethodsTexts.agreements.vipps.pending.button)}
              rightIcon={{svg: ExternalLink}}
              onPress={() => openUrl(pendingConfirmationUrl)}
              testID="completeVippsAgreementButton"
            />
          </GenericSectionItem>
        )
      ) : (
        <GenericSectionItem>
          <Button
            surfaceColor="accent"
            expanded={true}
            text={t(PaymentMethodsTexts.agreements.vipps.inactive.button)}
            rightIcon={{svg: ExternalLink}}
            loading={isLoading}
            // Also before it's shown as pending, so a second agreement can't be
            // created in the meantime
            disabled={hasOnlyPendingAgreement}
            onPress={onActivate}
            testID="activateVippsAgreementButton"
          />
        </GenericSectionItem>
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    flex: 1,
    rowGap: theme.spacing.large,
  },
  logoContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.border.radius.small,
    backgroundColor: VIPPS_BACKGROUND_COLOR,
  },
  texts: {
    rowGap: theme.spacing.small,
  },
}));
