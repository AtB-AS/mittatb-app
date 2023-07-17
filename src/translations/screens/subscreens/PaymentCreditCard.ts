import {translation as _} from '../../commons';

const PaymentCreditCardTexts = {
  header: {
    title: _('Betaling', 'Payment', 'Betaling'),
  },
  buttons: {
    restart: _('Start på nytt', 'Retry', 'Start på nytt'),
    goBack: _('Gå tilbake', 'Go back', 'Gå tilbake'),
  },
  errorMessages: {
    loading: _(
      'Oops - vi feila når vi prøvde å laste inn betalingsterminal. Supert om du prøver igjen 🤞',
      'Whoops - we failed when trying to load the payment terminal. Please try again 🤞',
      'Oops - vi feila når vi prøvde å laste inn betalingsterminal. Supert om du prøver igjen 🤞',
    ),
    reservation: _(
      'Oops - vi feila når vi prøvde å reservere billett. Supert om du prøver igjen 🤞',
      'Whoops - we failed when trying to reserve the ticket. Please try again 🤞',
      'Oops - vi feila når vi prøvde å reservere billett. Supert om du prøver igjen 🤞',
    ),
    capture: _(
      'Oops - vi feila når vi prosesserte betalingen. Supert om du prøver igjen 🤞',
      'Whoops - we failed while processing the payment. Please try again 🤞',
      'Oops - vi feila når vi prosesserte betalinga. Supert om du prøver igjen 🤞',
    ),
  },
  loading: _('Laster…', 'Loading…', 'Lastar…'),
};
export default PaymentCreditCardTexts;
