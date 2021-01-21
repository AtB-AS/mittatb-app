import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
  header: {
    leftButton: {
      text: _('Tilbake'),
      a11yLabel: _('Gå tilbake'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil'),
    failedOfferSearch: _('Klarte ikke å søke opp pris'),
    failedReservation: _('Klarte ikke å reservere billett'),
  },
  validityTexts: {
    zone: {
      single: (zoneName: string) => _(`Gyldig i sone ${zoneName}`),
      multiple: (zoneNameFrom: string, zoneNameTo: string) =>
        _(`Gyldig fra sone ${zoneNameFrom} til sone ${zoneNameTo}`),
    },
    startTime: _('Gyldig fra kjøpstidspunkt'),
  },
  totalCost: {
    title: _('Totalt'),
    label: _('Inkl. 6% mva'),
  },
  infoText: {
    part1: _(
      'Denne billetten blir gyldig med en gang kjøpet blir gjennomført.',
    ),
    part2: _('Du kan angre kjøpet i 2 minutter.'),
  },
  paymentButtonVipps: {
    text: _('Betal med Vipps'),
    a11yHint: _('Aktivér for å betale billett med Vipps'),
  },
  paymentButtonCard: {
    text: _('Betal med bankkort'),
    a11yHint: _('Aktivér for å betale billett med bankkort'),
  },
};
export default PurchaseConfirmationTexts;
