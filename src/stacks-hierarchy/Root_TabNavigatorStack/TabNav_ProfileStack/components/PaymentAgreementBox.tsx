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
import {View} from 'react-native';

type Props = {
  paymentType: PaymentType;
  /** The latest active payment agreement of this payment type, if any */
  agreement: PaymentAgreement | undefined;
  onActivate: () => void;
  onStop: (agreement: PaymentAgreement) => void;
  isLoading: boolean;
};

/**
 * Shows how to activate a payment agreement of the given payment type, or lets
 * the user stop the active one.
 */
export const PaymentAgreementBox = ({
  paymentType,
  agreement,
  onActivate,
  onStop,
  isLoading,
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  // Only Vipps agreements are supported for now
  if (paymentType !== PaymentType.Vipps) return null;

  const title = t(
    agreement
      ? PaymentMethodsTexts.agreements.vipps.active.title
      : PaymentMethodsTexts.agreements.vipps.inactive.title,
  );
  const description = t(
    agreement
      ? PaymentMethodsTexts.agreements.vipps.active.description
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
      <GenericSectionItem>
        {agreement ? (
          <Button
            surfaceColor="error"
            expanded={true}
            mode="secondary"
            text={t(PaymentMethodsTexts.agreements.vipps.active.stopButton)}
            loading={isLoading}
            onPress={() => onStop(agreement)}
            style={styles.button}
            testID="stopVippsAgreementButton"
          />
        ) : (
          <Button
            surfaceColor="accent"
            expanded={true}
            text={t(PaymentMethodsTexts.agreements.vipps.inactive.button)}
            rightIcon={{svg: ExternalLink}}
            loading={isLoading}
            onPress={onActivate}
            style={styles.button}
            testID="activateVippsAgreementButton"
          />
        )}
      </GenericSectionItem>
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
  button: {
    // Without this the GenericSectionItem squishes the button
    width: '100%',
  },
}));
