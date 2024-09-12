import {translation as _} from '../../commons';

const PurchasePaymentTexts = {
  header: {
    title: _('Betaling', 'Payment', 'Betaling'),
  },
  error: _(
    'Oops - vi feila når vi prøvde å sette i gang betalingen. Supert om du prøver igjen 🤞',
    'Whoops - we failed when trying to set up the payment. Please try again 🤞',
    'Oops - vi feila då vi prøvde å sette i gang betalinga. Supert om du prøver igjen 🤞',
  ),
  vippsInstalledError: _(
    'Vi klarte ikke å sette i gang betalingen. Har du Vipps-appen installert?',
    'We were unable to set up the payment. Do you have the Vipps app installed?',
    'Vi klarte ikkje å sette i gang betalingen. Har du Vipps-appen installert?',
  ),
  loading: _('Laster…', 'Loading…', 'Lastar…'),
};
export default PurchasePaymentTexts;
