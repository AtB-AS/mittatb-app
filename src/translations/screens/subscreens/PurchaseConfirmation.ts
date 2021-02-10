import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
  header: {
    leftButton: {
      text: {
        back: _('Tilbake', 'Back'),
        cancel: _('Avbryt', 'Cancel'),
      },
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    message: _(
      'Oops - vi klarte ikke å søke opp prisen. Supert om du prøver igjen 🤞',
      'Whoops - we were unable to retrieve cost. Please try again 🤞',
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
