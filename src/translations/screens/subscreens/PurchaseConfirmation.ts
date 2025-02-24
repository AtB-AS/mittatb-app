import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

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
  title: _('Billettsammendrag', 'Ticket summary', 'Billettsamandrag'),
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
    direction: {
      'one-way': (from: string, to: string) =>
        _(
          `Gyldig fra ${from} til ${to}`,
          `Valid from ${from} to ${to}`,
          `Gyldig frå ${from} til ${to}`,
        ),
      'two-way': (from: string, to: string) =>
        _(
          `Gyldig i begge retninger mellom ${from} og ${to}`,
          `Valid in both directions from ${from} to ${to}`,
          `Gyldig i begge retningar mellom ${from} og ${to}`,
        ),
    },
    harbor: {
      messageInHarborZones: _(
        'Gjelder for buss/trikk i sonene du reiser til og fra',
        'Applies for bus/tram in departure and destination zones',
        'Gjeld for buss/trikk i sonene du reiser til og frå',
      ),
      onlyOnPhone: _(
        'Kun gyldig på mobil',
        'Only valid on phone',
        'Kun gyldig på mobil',
      ),
    },
    time: (validTime: string) =>
      _(
        `Billettvarighet ${validTime} fra oppstart`,
        `Ticket duration ${validTime} from start time`,
        `Billettvarigheit ${validTime} frå oppstart`,
      ),
  },
  sendingTo: (phoneNumber: string) =>
    _(
      `Sendes til ${phoneNumber}`,
      `Sending to ${phoneNumber}`,
      `Sendes til ${phoneNumber}`,
    ),
  totalCost: {
    title: _('Totalt', 'Total', 'Totalt'),
    label: (vatPercentString: string, vatAmountString: string) =>
      _(
        `Inkl. ${vatPercentString}% mva (${vatAmountString} kr)`,
        `Incl. ${vatPercentString}% VAT (${vatAmountString} kr)`,
        `Inkl. ${vatPercentString}% mva (${vatAmountString} kr)`,
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

  paymentWithAnyService: {
    text: _(`Nytt kort`, `New card`, `Nytt kort`),
    a11yLabel: _(
      `Betal med Visa, Mastercard or American Express}`,
      `Pay with Visa, Mastercard or American Express}`,
      `Betal med Visa, Mastercard or American Express`,
    ),
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
  choosePaymentMethod: {
    text: _('Velg betalingsmåte', 'Choose payment option', 'Vel betalingsmåte'),
    a11yHint: _(
      'Aktiver for å velge betalingsmåte',
      'Activate to choose payment option',
      'Aktivér for å velje betalingsmåte',
    ),
  },
  changePaymentMethod: {
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
  },
  payWithVisa: {
    text: _('Betal med Visa', 'Pay with Visa', 'Betale med Visa'),
  },
  payWithMasterCard: {
    text: _(
      'Betal med MasterCard',
      'Pay with MasterCard',
      'Betal med MasterCard',
    ),
  },
  payWithAmex: {
    text: _(
      'Betal med American Express',
      'Pay with American Express',
      'Betal med American Express',
    ),
  },
  ordinaryPricePrefix: _(`Ord. pris`, `Ord. price`, `Ord. pris`),
  ordinaryPricePrefixA11yLabel: _(
    `Ordinær pris`,
    `Ordinary price`,
    `Ordinær pris`,
  ),
  reserveError: _(
    'Oops - vi feila når vi prøvde å sette i gang betalingen. Supert om du prøver igjen 🤞',
    'Whoops - we failed when trying to set up the payment. Please try again 🤞',
    'Oops - vi feila då vi prøvde å sette i gang betalinga. Supert om du prøver igjen 🤞',
  ),
  vippsInstalledError: _(
    'Vi klarte ikke å sette i gang betalingen. Har du Vipps-appen installert?',
    'We were unable to set up the payment. Do you have the Vipps app installed?',
    'Vi klarte ikkje å sette i gang betalingen. Har du Vipps-appen installert?',
  ),
};
export default orgSpecificTranslations(PurchaseConfirmationTexts, {
  fram: {
    validityTexts: {
      harbor: {
        messageInHarborZones: _('', '', ''),
      },
    },
  },
  nfk: {
    validityTexts: {
      harbor: {
        messageInHarborZones: _('', '', ''),
      },
    },
  },
  troms: {
    validityTexts: {
      harbor: {
        messageInHarborZones: _('', '', ''),
      },
    },
    travelDate: {
      now: _('Start nå', 'Starting now', 'Start no'),
    },
  },
});
