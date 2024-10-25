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
    text: _('Bekreft valg', 'Confirm selection', 'Bekreft val'),
    a11yhint: _(
      'Aktiver for å bekrefte valg av betalingsmåte',
      'Activate to confirm payment method',
      'Aktiver for å bekrefte val av betalingsmåte',
    ),
  },
  save_payment_method_description: {
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
