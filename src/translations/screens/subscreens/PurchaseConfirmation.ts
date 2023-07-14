import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
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
    time: (validTime: string) =>
      _(
        `Billettvarighet ${validTime} fra oppstart`,
        `Ticket duration ${validTime} from start time`,
      ),
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
  travelDate: {
    futureDate: (time: string) => _(`Oppstart ${time}`, `Start time ${time}`),
    now: _('Oppstart nå', 'Starting now'),
  },
  paymentButtonVipps: {
    text: _('Vipps', 'Vipps'),
    a11yLabel: _('Betal med Vipps', 'Pay with Vipps'),
    a11yHint: _('Aktivér for å betale med Vipps', 'Activate to pay with Vipps'),
  },
  paymentButtonCardVisa: {
    text: _('Visa', 'Visa'),
    a11yLabel: _('Betal med Visa', 'Pay with Visa'),
    a11yHint: _('Aktivér for å betale med Visa', 'Activate to pay with Visa'),
  },
  paymentButtonCardMC: {
    text: _('MasterCard', 'MasterCard'),
    a11yLabel: _('Betal med MasterCard', 'Pay with MasterCard'),
    a11yHint: _(
      'Aktivér for å betale med MasterCard',
      'Activate to pay with MasterCard',
    ),
  },
  paymentWithDefaultServices: {
    a11yLabel: (brand: string) => _(`Betal med ${brand}`, `Pay with ${brand}`),
    a11Hint: _(
      'Aktivér for velge denne betalingsmåten',
      'Activate to select this payment method',
    ),
  },
  paymentWithStoredCard: {
    a11yLabel: (brand: string, masked_pan: string) =>
      _(
        `Betal med ${brand} som slutter på ${masked_pan}`,
        `Pay with ${brand} ending in ${masked_pan}`,
      ),
    a11yHint: _(
      'Aktivér for å velge dette kortet',
      'Activate to select this card',
    ),
  },
  choosePaymentOption: {
    text: _('Velg betalingsmåte', 'Choose payment option'),
    a11yHint: _(
      'Aktiver for å velge betalingsmåte',
      'Activate to choose payment option',
    ),
  },
  changePaymentOption: {
    text: _('Endre betalingsmåte', 'Change payment option'),
    a11yHint: _(
      'Aktiver for å endre betalingsmåte',
      'Activate to change payment option',
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
  ordinaryPricePrefix: _(`Ord. pris`, `Ord. price`),
  ordinaryPricePrefixA11yLabel: _(`Ordinær pris`, `Ordinary price`),
};
export default PurchaseConfirmationTexts;
