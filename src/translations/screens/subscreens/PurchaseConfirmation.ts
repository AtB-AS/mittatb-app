import {translation as _} from '../../commons';

const PurchaseConfirmationTexts = {
  errorMessageBox: {
    title: _(
      'Det oppstod en feil',
      'An error occurred',
      'Det oppstod ein feil',
    ),
    message: _(
      'Oops - vi klarte ikke å søke opp prisen. Supert om du prøver igjen 🤞',
      'Whoops - we were unable to retrieve cost. Please try again 🤞',
      'Oops - vi klarte ikkje å søke opp prisen. Supert om du prøvar igjen 🤞',
    ),
  },
  validityTexts: {
    zone: {
      single: (zoneName: string) =>
        _(
          `Gyldig i sone ${zoneName}`,
          `Valid in zone ${zoneName}`,
          `Gyldig i sone ${zoneName}`,
        ),
      multiple: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Gyldig fra sone ${zoneNameFrom} til sone ${zoneNameTo}`,
          `Valid from zone ${zoneNameFrom} to zone ${zoneNameTo}`,
          `Gyldig frå sone ${zoneNameFrom} til sone ${zoneNameTo}`,
        ),
    },
  },
  totalCost: {
    title: _('Totalt', 'Total', 'Totalt'),
    label: (vatPercentString: string, vatAmountString: string) =>
      _(
        `Inkl. ${vatPercentString}% mva (${vatAmountString} kr)`,
        `Incl. ${vatPercentString}% VAT (${vatAmountString} kr)`,
        `Inkl. ${vatPercentString}% mva (${vatAmountString} kr)`,
      ),
  },
  infoText: {
    validNow: _(
      'Denne billetten blir gyldig med en gang kjøpet blir gjennomført.',
      'This ticket is valid when the purchase is completed.',
      'Denne billetten blir gyldig med ein gong kjøpet blir gjennomført.',
    ),
    validInFuture: (time: string) =>
      _(
        `Denne billetten blir gyldig fra ${time}.`,
        `This ticket will be valid from ${time}.`,
        `Denne billetten blir gyldig frå ${time}.`,
      ),
  },
  travelDate: {
    futureDate: (time: string) =>
      _(`Oppstart ${time}`, `Start time ${time}`, `Oppstart ${time}`),
    now: _('Oppstart nå', 'Starting now', 'Oppstart no'),
  },
  paymentButtonVipps: {
    text: _('Vipps', 'Vipps', 'Vipps'),
    a11yLabel: _('Betal med Vipps', 'Pay with Vipps', 'Betal med Vipps'),
    a11yHint: _(
      'Aktivér for å betale med Vipps',
      'Activate to pay with Vipps',
      'Aktivér for å betale med Vipps',
    ),
  },
  paymentButtonCardVisa: {
    text: _('Visa', 'Visa', 'Visa'),
    a11yLabel: _('Betal med Visa', 'Pay with Visa', 'Betal med Visa'),
    a11yHint: _(
      'Aktivér for å betale med Visa',
      'Activate to pay with Visa',
      'Aktivér for å betale med Visa',
    ),
  },
  paymentButtonCardMC: {
    text: _('MasterCard', 'MasterCard', 'MasterCard'),
    a11yLabel: _(
      'Betal med MasterCard',
      'Pay with MasterCard',
      'Betal med MasterCard',
    ),
    a11yHint: _(
      'Aktivér for å betale med MasterCard',
      'Activate to pay with MasterCard',
      'Aktivér for å betale med MasterCard',
    ),
  },
  paymentWithDefaultServices: {
    a11yLabel: (brand: string) =>
      _(`Betal med ${brand}`, `Pay with ${brand}`, `Betal med ${brand}`),
    a11Hint: _(
      'Aktivér for velge denne betalingsmåten',
      'Activate to select this payment method',
      'Aktivér for å velje denne betalingsmetoden',
    ),
  },
  paymentWithStoredCard: {
    a11yLabel: (brand: string, masked_pan: string) =>
      _(
        `Betal med ${brand} som slutter på ${masked_pan}`,
        `Pay with ${brand} ending in ${masked_pan}`,
        `Betal med ${brand} som endar på ${masked_pan}`,
      ),
    a11yHint: _(
      'Aktivér for å velge dette kortet',
      'Activate to select this card',
      'Aktivér for å velje dette kortet',
    ),
  },
  choosePaymentOption: {
    text: _('Velg betalingsmåte', 'Choose payment option', 'Vel betalingsmåte'),
    a11yHint: _(
      'Aktiver for å velge betalingsmåte',
      'Activate to choose payment option',
      'Aktivér for å velje betalingsmåte',
    ),
  },
  changePaymentOption: {
    text: _(
      'Endre betalingsmåte',
      'Change payment option',
      'Endre betalingsmåte',
    ),
    a11yHint: _(
      'Aktiver for å endre betalingsmåte',
      'Activate to change payment option',
      'Aktiver for å endre betalingsmåte',
    ),
  },
  payWithVipps: {
    text: _('Betal med Vipps', 'Pay with Vipps', 'Betale med Vipps'),
    a11yHint: _(
      'Aktiver for å betale med Vipps',
      'Activate to pay with Vipps',
      'Aktivér for å betale med Vipps',
    ),
  },
  payWithVisa: {
    text: _('Betal med Visa', 'Pay with Visa', 'Betale med Visa'),
    a11yHint: _(
      'Aktiver for å betale med Visa',
      'Activate to pay with Visa',
      'Aktivér for å betale med Visa',
    ),
  },
  payWithMasterCard: {
    text: _(
      'Betal med MasterCard',
      'Pay with MasterCard',
      'Betal med MasterCard',
    ),
    a11yHint: _(
      'Aktiver for å betale med MasterCard',
      'Activate to pay with MasterCard',
      'Aktivér for å betale med MasterCard',
    ),
  },
  ordinaryPricePrefix: _(`Ord. pris`, `Ord. price`, `Ord. pris`),
  ordinaryPricePrefixA11yLabel: _(
    `Ordinær pris`,
    `Ordinary price`,
    `Ordinær pris`,
  ),
};
export default PurchaseConfirmationTexts;
