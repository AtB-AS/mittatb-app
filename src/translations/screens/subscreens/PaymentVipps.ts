import {translation as _} from '../../commons';

const PaymentVippsTexts = {
  header: {
    title: _('Videresendes til Vipps', 'Redirecting to Vipps'),
  },
  buttons: {
    goToVipps: _('Gå til Vipps for betaling', 'Go to Vipps-app for payment'),
    tryAgain: _('Prøv igjen', 'Try again'),
    goBack: _('Gå tilbake', 'Go back'),
  },
  errorMessages: {
    openVipps: _(
      'Oops - Vi klarte ikke å åpne Vipps. Har du installert Vipps-appen?',
      'Whoops - We were unable to open Vipps. Please try again. 🤞',
    ),
    reserveOffer: _(
      'Oops - Vi klarte ikke å reservere billett. Supert om du prøver igjen 🤞',
      'Whoops - We were unable to reserve your ticket. Please try again. 🤞',
    ),
  },
  stateMessages: {
    reserving: _('Reserverer billett…', 'Reserving ticket…'),
    reserved: _('Åpner Vipps…', 'Opening Vipps…'),
  },
};
export default PaymentVippsTexts;
