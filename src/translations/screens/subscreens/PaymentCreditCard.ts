import {translation as _} from '../../commons';

const PaymentCreditCardTexts = {
  header: {
    title: _('Betaling', 'Payment', 'Betaling'),
  },
  buttons: {
    restart: _('Start på nytt', 'Retry', 'Start på nytt'),
    goBack: _('Gå tilbake', 'Go back', 'Gå tilbake'),
  },
  error: _(
    'Oops - vi feila når vi prøvde sette i gang betalingen. Supert om du prøver igjen 🤞',
    'Whoops - we failed when trying to set up the payment. Please try again 🤞',
    'Oops - vi feila når vi prøvde sette i gang betalingen. Supert om du prøver igjen 🤞',
  ),
  loading: _('Laster…', 'Loading…', 'Lastar…'),
};
export default PaymentCreditCardTexts;
