import {ContentHeading} from '@atb/components/heading';
import {
  getLatestPaymentAgreement,
  PaymentAgreement,
  PaymentType,
  SUPPORTED_PAYMENT_AGREEMENT_TYPES,
} from '@atb/modules/ticketing';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {View} from 'react-native';
import {PaymentAgreementBox} from './PaymentAgreementBox';

type Props = {
  /**
   * The user's active payment agreements. Must be loaded, since the user could
   * otherwise be offered to activate an agreement that already exists.
   */
  agreements: PaymentAgreement[];
  /** The user's payment agreements that are still being created */
  pendingAgreements: PaymentAgreement[] | undefined;
  onActivate: (paymentType: PaymentType) => void;
  onStop: (agreement: PaymentAgreement) => void;
  isLoading: boolean;
  /** Highlights the section to help the user discover payment agreements */
  showNotification?: boolean;
};

export const PaymentAgreementsSection = ({
  agreements,
  pendingAgreements,
  onActivate,
  onStop,
  isLoading,
  showNotification,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ContentHeading
        text={t(PaymentMethodsTexts.agreements.heading)}
        notificationCount={showNotification ? 1 : undefined}
      />
      {SUPPORTED_PAYMENT_AGREEMENT_TYPES.map((paymentType) => (
        <PaymentAgreementBox
          key={paymentType}
          paymentType={paymentType}
          agreement={getLatestPaymentAgreement(agreements, paymentType)}
          pendingAgreement={getLatestPaymentAgreement(
            pendingAgreements,
            paymentType,
          )}
          onActivate={() => onActivate(paymentType)}
          onStop={onStop}
          isLoading={isLoading}
        />
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
}));
