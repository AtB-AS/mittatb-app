import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const PurchaseOverviewTexts = {
  travelSearchInfo: _(
    'Vi har fylt inn oppstartstidpunkt og holdeplasser for din reise. Vennligst sjekk at detaljene stemmer.',
    'We have filled in the start time and stops for your journey. Please check that the details are correct.',
  ),
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    message: _(
      'Oops - vi klarte ikke å søke opp prisen. Supert om du prøver igjen 🤞',
      'Whoops - we were unable to retrieve cost. Please try again 🤞',
    ),
    productUnavailable: (productName: string) =>
      _(
        `${productName} er ikke tilgjengelig akkurat nå.`,
        `${productName} is not available right now.`,
      ),
  },
  travellers: {
    prefix: _('Nåværende valg: ', 'Current selection: '),
    noTravellers: _(`Ingen reisende`, `No travellers`),
    travellersCount: (count: number) =>
      _(`${count} reisende`, `${count} travellers`),
    a11yHint: _(
      'Aktivér for å velge reisende',
      `Activate to select travellers`,
    ),
  },
  product: {
    a11yHint: _(
      'Aktivér for å velge billettype',
      'Activate to select ticket type',
    ),
  },
  warning: _(
    'Når du er ute og reiser må du ha med t:kortet som er registrert på din profil.',
    'When traveling, you need to bring the t:card registered on your profile.',
  ),
  samarbeidsbillettenInfo: {
    single: _(
      'Enkeltbilletter i sone A kan også brukes på tog i sone A. De kan imidlertid ikke brukes på nattbusser.',
      'Single tickets in zone A can also be used on train in zone A. However they cannot be used on night buses.',
    ),
    period: _(
      'Periodebilletter i sone A kan også brukes på tog i sone A.',
      'Periodic tickets in zone A can also be used on train in zone A.',
    ),
    hour24: _(
      '24-timersbillett kan ikke brukes på tog eller nattbuss.',
      '24 hour pass can not be used on trains nor night buses.',
    ),
  },
  nfkNightBusNotice: _("3- og 7-dagers kan ikke brukes på nattbuss", "3 and 7 day tickets can not be used on night bus"),
  zones: {
    title: {
      single: {
        text: _('Velg holdeplass/sone (kun én)', 'Select stop/zone (only one)'),
        a11yLabel: _(
          'Velg holdeplass eller sone (kun én)',
          'Select stop or zone (only one)',
        ),
      },
      multiple: {
        text: _('Velg holdeplass/sone(r)', 'Select stop/zone(s)'),
        a11yLabel: _('Velg holdeplass eller soner', 'Select stop or zones'),
      },
    },
    label: {
      from: _('Fra', 'From'),
      to: _('Til', 'To'),
    },
    zoneName: (zoneName: string) => _(`Sone ${zoneName}`, `Zone ${zoneName}`),
    a11yLabelPrefixSingle: _('Valgt sone:', 'Selected zone:'),
    a11yLabelPrefixMultiple: _('Valgte soner:', 'Selected zones:'),
    a11yHint: _('Aktivér for å velge soner', 'Activate to select zones'),
  },
  productSelection: {
    title: _('Velg billett', 'Select a ticket'),
    a11yTitle: _('Aktiver for å velge billett', 'Activate to select ticket'),
  },
  travellerSelection: {
    title_single: _('Velg passasjerkategori', 'Select a traveller'),
    title_multiple: _('Velg passasjerkategorier', 'Select travellers'),
    a11yHint: _('Aktiver for å velge reisende', 'Activate to select traveller'),
  },
  infoToggle: {
    label: _('Vis info', 'Show info'),
    travellerA11yLabel: _(
      'Vis informasjon om passasjerkategorier',
      'Show information about traveller categories',
    ),
    productTicketA11yLabel: _(
      'Vis informasjon om produkter',
      'Show information about products',
    ),
  },
  startTime: {
    title: _('Velg oppstartstidspunkt', 'Select start time'),
    now: _('Oppstart nå', 'Start now'),
    later: _('Senere', 'Later'),
    a11yLaterHint: _(
      'Aktiver for å velge et senere oppstartstidspunkt',
      'Activate to select a later start time',
    ),
    a11yNowHint: _(
      'Aktiver for å sette oppstartstidspunkt til nå.',
      'Activate to set ticket start time to now.',
    ),
  },
  summary: {
    price: (priceString: string) =>
      _(`Totalt ${priceString} kr`, `Total ${priceString} kr`),
    messageInZone: _(
      `Gjelder for buss/trikk i valgte soner`,
      `Applies for bus/tram in selected zones`,
    ),
    messageAppliesFor: (text: string) =>
      _(`Gjelder for ${text}`, `Applies for ${text}`),
    button: _('Til betaling', 'To payment'),
  },
  flexDiscount: {
    heading: _('Rabatt', 'Discount'),
    expandableLabel: _('Din rabatt og pris', 'Your discount and price'),
    description: _(
      'Enkeltbillett voksen har rabatt i Sone A basert på antall kjøp de siste 14 dagene når du er med i pilot for Fleksibel billett.',
      "Adult single tickets get discounts in zone A based on the number of purchases in the last 14 days when you're participating in the Flexible ticket pilot.",
    ),
    per: (userProfileName: string) =>
      _(`Pr. ${userProfileName}`, `Per ${userProfileName}`),
    discountPercentage: (discount: string) =>
      _(`${discount} % rabatt`, `${discount} % discount`),
    link: _('Les mer og se rabattabell', 'Read more and see discount details'),
    a11yHint: _(
      'Aktivér for å lese mer om rabatt på fleksibel billett på ekstern side',
      'Activate to read more about the details for discount on flexible tickets (external content)',
    ),
  },
};

export default orgSpecificTranslations(PurchaseOverviewTexts, {
  nfk: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din profil.',
      'When traveling, you need to bring the travel card registered on your profile.',
    ),
    summary: {
      messageInZone: _(
        `Gjelder for buss i valgte soner`,
        `Applies for bus in selected zones`,
      ),
    },
  },
  fram: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din bruker.',
      'When traveling, you need to bring the travel card registered on your user.',
    ),
    summary: {
      messageInZone: _(
        `Gjelder for buss i valgte soner`,
        `Applies for bus in selected zones`,
      ),
    },
  },
});
