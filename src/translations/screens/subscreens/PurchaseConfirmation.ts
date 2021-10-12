import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
  header: {
    title: {
      single: _('Enkeltbillett', 'Single ticket'),
      period: _('Periodebillett', 'Period ticket'),
      carnet: _('Klippekort', 'Carnet ticket'),
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
        _(`Gyldig i sone ${zoneName}`, `Valid in zone ${zoneName}`),
      multiple: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Gyldig fra sone ${zoneNameFrom} til sone ${zoneNameTo}`,
          `Valid from zone ${zoneNameFrom} to zone ${zoneNameTo}`,
        ),
    },
  },
  totalCost: {
    title: _('Totalt', 'Total'),
    label: (vatPercentString: string, vatAmountString: string) =>
      _(
        `Inkl. ${vatPercentString}% mva (${vatAmountString} kr)`,
        `Incl. ${vatPercentString}% VAT (${vatAmountString} kr)`,
      ),
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
    text: _('Vipps', 'Vipps'),
    a11yHint: _(
      'Aktivér for å betale billett med Vipps',
      'Activate to pay your ticket by Vipps service',
    ),
  },
  paymentButtonCardVisa: {
    text: _('Visa', 'Visa'),
    a11yHint: _(
      'Aktivér for å betale billett med Visa',
      'Activate to pay your ticket with Visa',
    ),
  },
  paymentButtonCardMC: {
    text: _('MasterCard', 'MasterCard'),
    a11yHint: _(
      'Aktivér for å betale billett med MasterCard',
      'Activate to pay your ticket with MasterCard',
    ),
  },
  choosePaymentOption: {
    text: _('Velg betalingsmåte', 'Choose payment option'),
    a11yHint: _(
      'Aktiver for å velge betalingsmåte',
      'Activate to choose payment option',
    ),
  },
  payWithVipps: {
    text: _('Betal med Vipps', 'Pay with Vipps'),
    a11yHint: _('Aktiver for å betale med Vipps', 'Activate to pay with Vipps'),
  },
  payWithVisa: {
    text: _('Betal med Visa', 'Pay with Visa'),
    a11yHint: _('Aktiver for å betale med Visa', 'Activate to pay with Visa'),
  },
  payWithMasterCard: {
    text: _('Betal med MasterCard', 'Pay with MasterCard'),
    a11yHint: _(
      'Aktiver for å betale med MasterCard',
      'Activate to pay with MasterCard',
    ),
  },
};
export default PurchaseConfirmationTexts;
