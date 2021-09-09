import {translation as _} from '../../commons';

const SelectPaymentMethodTexts = {
  header: {
    text: _('Velg betalingsmåte', 'Select payment method'),
  },
  confirm_button: {
    text: _('Til betaling', 'Confirm option'),
    a11yhint: _(
      'Aktiver for å gå videre til betaling',
      'Activate to go ahead with payment with selected option',
    ),
  },
  save_payment_option_description: {
    text: _(
      'Lagre bankkortet for fremtidige betalinger',
      'Save the payment card for future usage',
    ),
  },
  save_card: {
    text: _('Lagre kort', 'Save card'),
  },
};

export default SelectPaymentMethodTexts;
