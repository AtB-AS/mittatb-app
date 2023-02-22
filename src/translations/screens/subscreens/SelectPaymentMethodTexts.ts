import {translation as _} from '../../commons';

const SelectPaymentMethodTexts = {
  header: {
    text: _('Velg betalingsmåte', 'Select payment option'),
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
  save_card: _('Lagre kort', 'Save card'),
  a11yHint: {
    notSave: _('Aktiver for ikke å lagre kort', 'Activate to not save card'),
    save: _('Aktiver for å lagre kort', 'Activate to save card'),
  },
  saved_cards: {
    text: _('Lagrede kort', 'Stored cards'),
  },
};

export default SelectPaymentMethodTexts;
