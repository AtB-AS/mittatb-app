import {translation as _} from '../../commons';

const PaymentCreditCardTexts = {
  header: {
    title: _('Betaling'),
    leftButton: {
      a11yLabel: _('Avslutt kort-betaling og gå tilbake'),
    },
  },
  buttons: {
    restart: _('Start på nytt'),
    goBack: _('Gå tilbake'),
  },
  errorMessages: {
    loading: _(
      'Oops - vi feila når vi prøvde å laste inn betalingsterminal. Supert om du prøver igjen 🤞',
    ),
    reservation: _(
      'Oops - vi feila når vi prøvde å reservere billett. Supert om du prøver igjen 🤞',
    ),
    capture: _(
      'Oops - vi feila når vi prosessere betaling. Supert om du prøver igjen 🤞',
    ),
  },
  stateMessages: {
    reserving: _('Reserverer billett…'),
    loading: _('Laster betalingsterminal…'),
    processing: _('Prosesserer betaling…'),
  },
};
export default PaymentCreditCardTexts;
