import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
  header: {
    leftButton: {
      text: _('Tilbake', 'Back'),
      a11yLabel: _('Gå tilbake', 'Go back'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    failedOfferSearch: _(
      'Klarte ikke å søke opp pris',
      'Unable to retrieve cost',
    ),
    failedReservation: _(
      'Klarte ikke å reservere billett',
      'Unable to book a ticket',
    ),
  },
  validityTexts: {
    zone: {
      single: (zoneName: string) =>
        _(`Gyldig i sone ${zoneName}`, `Valid through zone ${zoneName}`),
      multiple: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Gyldig fra sone ${zoneNameFrom} til sone ${zoneNameTo}`,
          `Valid from zone ${zoneNameFrom} to zone ${zoneNameTo}`,
        ),
    },
    startTime: _('Gyldig fra kjøpstidspunkt', 'Valid from time of purchase'),
  },
  totalCost: {
    title: _('Totalt', 'Total'),
    label: _('Inkl. 6% mva', 'Incl. 6% VAT'),
  },
  infoText: {
    part1: _(
      'Denne billetten blir gyldig med en gang kjøpet blir gjennomført.',
      'This ticket is valid when the purchase is completed.',
    ),
    // part2: _('Du kan angre kjøpet i 2 minutter.', 'You can undo this purchase within 2 min.'),
  },
  paymentButtonVipps: {
    text: _('Betal med Vipps', 'Pay by Vipps service'),
    a11yHint: _(
      'Aktivér for å betale billett med Vipps',
      'Activate to pay your ticket by Vipps service',
    ),
  },
  paymentButtonCard: {
    text: _('Betal med bankkort', 'Pay by credit card'),
    a11yHint: _(
      'Aktivér for å betale billett med bankkort',
      'Activate to pay your ticket by credit card',
    ),
  },
};
export default PurchaseConfirmationTexts;
