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
      'Klarte ikke å åpne Vipps. Sjekk at du har installert Vipps-appen, og prøv igjen.',
      "Couldn't open Vipps. Check that you have installed the Vipps app, and try again.",
      'Klarte ikkje å opne Vipps. Sjekk at du har installert Vipps-appen, og prøv igjen.',
    ),
    reserveOffer: _(
      'Klarte ikke å reservere billett. Prøv igjen, eller kontakt kundeservice for hjelp.',
      "Couldn't reserve a ticket. Please try again, or contact customer service for assistance.",
      'Klarte ikkje å reservere billett. Prøv igjen, eller kontakt kundeservice for hjelp.',
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
