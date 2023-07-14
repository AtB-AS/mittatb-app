import {translation as _} from '../../commons';

const PaymentVippsTexts = {
  header: {
    title: _(
      'Videresendes til Vipps',
      'Redirecting to Vipps',
      'Videresendast til Vipps',
    ),
  },
  buttons: {
    goToVipps: _(
      'Gå til Vipps for betaling',
      'Go to Vipps-app for payment',
      'Gå til Vipps for betaling',
    ),
    tryAgain: _('Prøv igjen', 'Try again', 'Prøv igjen'),
    goBack: _('Gå tilbake', 'Go back', 'Gå tilbake'),
  },
  errorMessages: {
    openVipps: _(
      'Oops - Vi klarte ikke å åpne Vipps. Har du installert Vipps-appen?',
      'Whoops - We were unable to open Vipps. Please try again. 🤞',
      'Oops - Vi klarte ikkje å opne Vipps. Har du installert Vipps-appen?',
    ),
    reserveOffer: _(
      'Oops - Vi klarte ikke å reservere billett. Supert om du prøver igjen 🤞',
      'Whoops - We were unable to reserve your ticket. Please try again. 🤞',
      'Oops - Vi klarte ikkje å reservere billett. Supert om du prøvar igjen 🤞',
    ),
  },
  stateMessages: {
    reserving: _(
      'Reserverer billett…',
      'Reserving ticket…',
      'Reserverer billett…',
    ),
    reserved: _('Åpner Vipps…', 'Opening Vipps…', 'Opnar Vipps…'),
  },
};
export default PaymentVippsTexts;
