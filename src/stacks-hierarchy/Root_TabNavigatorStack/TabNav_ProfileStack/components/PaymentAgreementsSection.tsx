import {ContentHeading} from '@atb/components/heading';
import {
  getLatestPaymentAgreement,
  PaymentAgreement,
  PaymentType,
} from '@atb/modules/ticketing';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {View} from 'react-native';
import {PaymentAgreementBox} from './PaymentAgreementBox';

const SUPPORTED_PAYMENT_TYPES = [PaymentType.Vipps];

type Props = {
  /**
   * The user's active payment agreements. Must be loaded, since the user could
   * otherwise be offered to activate an agreement that already exists.
   */
  agreements: PaymentAgreement[];
  onActivate: (paymentType: PaymentType) => void;
  onStop: (agreement: PaymentAgreement) => void;
  isLoading: boolean;
};

export const PaymentAgreementsSection = ({
  agreements,
  onActivate,
  onStop,
  isLoading,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ContentHeading text={t(PaymentMethodsTexts.agreements.heading)} />
      {SUPPORTED_PAYMENT_TYPES.map((paymentType) => (
        <PaymentAgreementBox
          key={paymentType}
          paymentType={paymentType}
          agreement={getLatestPaymentAgreement(agreements, paymentType)}
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
