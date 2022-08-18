import {translation as _} from '../../commons';

const PaymentCreditCardTexts = {
  header: {
    title: _('Betaling', 'Payment'),
  },
  buttons: {
    restart: _('Start på nytt', 'Retry'),
    goBack: _('Gå tilbake', 'Go back'),
  },
  errorMessages: {
    loading: _(
      'Oops - vi feila når vi prøvde å laste inn betalingsterminal. Supert om du prøver igjen 🤞',
      'Whoops - we failed when trying to load the payment terminal. Please try again 🤞',
    ),
    reservation: _(
      'Oops - vi feila når vi prøvde å reservere billett. Supert om du prøver igjen 🤞',
      'Whoops - we failed when trying to reserve the ticket. Please try again 🤞',
    ),
    capture: _(
      'Oops - vi feila når vi prosessere betaling. Supert om du prøver igjen 🤞',
      'Whoops - we failed while processing the payment. Please try again 🤞',
    ),
  },
  loading: _('Laster…', 'Loading…'),
};
export default PaymentCreditCardTexts;
