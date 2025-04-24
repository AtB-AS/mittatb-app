import {translation as _} from '../../commons';

const SelectPaymentMethodTexts = {
  header: {
    text: _(
      'Velg betalingsmåte',
      'Select payment method',
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
  multiple_payment: {
    title: _('Nytt kort', 'New card', 'Nytt kort'),
    text: _(
      'Vil du lagre bankkortet for fremtidige betalinger?',
      'Would you like to save your bank card for future payments?',
      'Vil du lagre bankkortet for framtidige betalingar?',
    ),
    information: _(
      'Vi lagrer kortinformasjonen i opptil 3 år.',
      'We store the card information for up to 3 years.',
      'Vi lagrar kortinformasjonen i opptil 3 år.',
    ),
  },
  save_card: _('Lagre bankkort', 'Save bank card', 'Lagre bankkort'),

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
    text: _('Lagrede kort', 'Saved cards', 'Lagra kort'),
  },
  other_cards: {
    text: _(
      'Andre betalingsmåter',
      'Other payment methods',
      'Andre betalingsmåtar',
    ),
  },
};

export default SelectPaymentMethodTexts;
