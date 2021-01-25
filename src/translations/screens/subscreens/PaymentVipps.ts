import {translation as _} from '../../commons';

const PaymentVippsTexts = {
  header: {
    title: _('Videresendes til Vipps'),
    leftButton: {
      a11yLabel: _('Avslutt Vipps-betaling og gå tilbake'),
    },
  },
  buttons: {
    goToVipps: _('Gå til Vipps for betaling'),
    tryAgain: _('Prøv igjen'),
    goBack: _('Gå tilbake'),
  },
  errorMessages: {
    openVipps: _(
      'Oops - Vi klarte ikke å åpne Vipps. Har du installert Vipps-appen?',
    ),
    reserveOffer: _(
      'Oops - Vi klarte ikke å reservere billett. Supert om du prøver igjen 🤞',
    ),
  },
  stateMessages: {
    reserving: _('Reserverer billett…'),
    reserved: _('Åpner vipps…'),
  },
};
export default PaymentVippsTexts;
