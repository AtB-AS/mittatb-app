import {CheckboxSectionItem, SectionItemProps} from '@atb/components/sections';
import {PaymentType} from '@atb/modules/ticketing';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';

type Props = SectionItemProps<{
  paymentType: PaymentType;
  isChecked: boolean;
  onPress: () => void;
}>;

/**
 * Lets the user create a payment agreement of the given payment type as part
 * of the payment.
 */
export const CreatePaymentAgreementCheckbox = ({
  paymentType,
  isChecked,
  onPress,
  ...props
}: Props) => {
  const {t} = useTranslation();

  // The texts are specific to Vipps
  if (paymentType !== PaymentType.Vipps) return null;

  return (
    <CheckboxSectionItem
      {...props}
      title={t(PurchaseConfirmationTexts.createPaymentAgreement.vipps.title)}
      description={t(PaymentMethodsTexts.agreements.vipps.inactive.description)}
      label="new"
      isChecked={isChecked}
      onPress={onPress}
      testID="createPaymentAgreementCheckbox"
    />
  );
};
