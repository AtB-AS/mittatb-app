import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
  header: {
    title: {
      single: _('Enkeltbillett', 'Single ticket'),
      period: _('Periodebillett', 'Period ticket'),
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
  },
  totalCost: {
    title: _('Totalt', 'Total'),
    label: (vatString: string) =>
      _(`Inkl. 6% mva (${vatString} kr)`, `Incl. 6% VAT (${vatString} kr)`),
  },
  infoText: {
    validNow: _(
      'Denne billetten blir gyldig med en gang kjøpet blir gjennomført.',
      'This ticket is valid when the purchase is completed.',
    ),
    validInFuture: (time: string) =>
      _(
        `Denne billetten blir gyldig fra ${time}.`,
        `This ticket will be valid from ${time}.`,
      ),
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
