import {translation as _} from '../../commons';

const SelectPaymentMethodTexts = {
  header: {
    text: _(
      'Velg betalingsmåte',
      'Select payment option',
      'Vel betalingsmetode',
    ),
  },
  confirm_button: {
    text: _('Til betaling', 'Confirm option', 'Til betaling'),
    a11yhint: _(
      'Aktiver for å gå videre til betaling',
      'Activate to go ahead with payment with selected option',
      'Aktiver for å gå vidare til betaling',
    ),
  },
  save_payment_option_description: {
    text: _(
      'Lagre bankkortet for fremtidige betalinger',
      'Save the payment card for future usage',
      'Lagre betalingskortet for framtidige betalingar',
    ),
  },
  save_card: _('Lagre kort', 'Save card', 'Lagre kort'),
  a11yHint: {
    notSave: _(
      'Aktiver for ikke å lagre kort',
      'Activate to not save card',
      'Aktiver for ikkje å lagre kort',
    ),
    save: _(
      'Aktiver for å lagre kort',
      'Activate to save card',
      'Aktiver for å lagre kort',
    ),
  },
  saved_cards: {
    text: _('Lagrede kort', 'Stored cards', 'Lagra kort'),
  },
};

export default SelectPaymentMethodTexts;
