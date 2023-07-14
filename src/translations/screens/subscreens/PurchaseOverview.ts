import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const PurchaseOverviewTexts = {
  travelSearchInfo: _(
    'Vi har fylt inn oppstartstidpunkt og holdeplasser for din reise. Vennligst sjekk at detaljene stemmer.',
    'We have filled in the start time and stops for your journey. Please check that the details are correct.',
    'Vi har fylt inn oppstartstidspunkt og haldeplassar for reisa di. Ver venleg og sjekk at detaljane er korrekte.',
  ),
  errorMessageBox: {
    title: _(
      'Det oppstod en feil',
      'An error occurred',
      'Det oppstod ein feil',
    ),
    message: _(
      'Oops - vi klarte ikke å søke opp prisen. Supert om du prøver igjen 🤞',
      'Whoops - we were unable to retrieve cost. Please try again 🤞',
      'Oops - vi klarte ikkje å finne prisinformasjonen. Prøv igjen 🤞',
    ),
    productUnavailable: (productName: string) =>
      _(
        `${productName} er ikke tilgjengelig akkurat nå.`,
        `${productName} is not available right now.`,
        `${productName} er ikkje tilgjengeleg nett no.`,
      ),
  },
  travellers: {
    prefix: _('Nåværende valg: ', 'Current selection: ', 'Noverande val: '),
    noTravellers: _(`Ingen reisende`, `No travellers`, `Ingen reisande`),
    travellersCount: (count: number) =>
      _(`${count} reisende`, `${count} travellers`, `${count} reisande`),
    a11yHint: _(
      'Aktivér for å velge reisende',
      `Activate to select travellers`,
      'Aktivér for å velje reisande',
    ),
  },
  product: {
    a11yHint: _(
      'Aktivér for å velge billettype',
      'Activate to select ticket type',
      'Aktivér for å velje biletttype',
    ),
  },
  warning: _(
    'Når du er ute og reiser må du ha med t:kortet som er registrert på din profil.',
    'When traveling, you need to bring the t:card registered on your profile.',
    'Når du er ute og reiser må du ha med t:kortet som er registrert på profilen din.',
  ),
  samarbeidsbillettenInfo: {
    single: _(
      'Enkeltbilletter i sone A kan også brukes på tog i sone A, men ikke på nattbuss.',
      'Single tickets in zone A can also be used on train in zone A, but not on night buses.',
      'Enkeltbillettar i sone A kan også brukast på tog i sone A, men ikkje på nattbuss.',
    ),
    period: _(
      'Periodebilletter i sone A kan også brukes på tog i sone A.',
      'Periodic tickets in zone A can also be used on train in zone A.',
      'Periodebilettar i sone A kan også brukast på tog i sone A.',
    ),
    hour24: _(
      '24-timersbillett i sone A kan også brukes på tog i sone A, men ikke på nattbuss.',
      '24 hour pass in zone A can also be used on train in zone A, but not on night buses.',
      '24-timersbilett i sone A kan også brukast på tog i sone A, men ikkje på nattbuss.',
    ),
  },
  nfkNightBusPeriodNotice: _(
    '3- og 7-dagers billett inkluderer ikke nattbuss.',
    '3 and 7 day periodic tickets does not include night bus.',
    '3- og 7-dagers bilett inkluderer ikkje nattbuss.',
  ),
  nfkNightBusHour24Notice: _(
    '24-timersbilletten inkluderer ikke nattbuss.',
    'The 24 hour pass does not include night bus.',
    '24-timersbiletten inkluderer ikkje nattbuss.',
  ),
  zones: {
    title: {
      single: {
        text: _(
          'Velg holdeplass/sone (kun én)',
          'Select stop/zone (only one)',
          'Vel haldeplass/sona (berre éin)',
        ),
        a11yLabel: _(
          'Velg holdeplass eller sone (kun én)',
          'Select stop or zone (only one)',
          'Vel haldeplass eller sone (berre éin)',
        ),
      },
      multiple: {
        text: _(
          'Velg holdeplass/sone(r)',
          'Select stop/zone(s)',
          'Vel haldeplassar/soner',
        ),
        a11yLabel: _(
          'Velg holdeplass eller soner',
          'Select stop or zones',
          'Vel haldeplassar eller soner',
        ),
      },
    },
    label: {
      from: _('Fra', 'From', 'Frå'),
      to: _('Til', 'To', 'Til'),
    },
    zoneName: (zoneName: string) =>
      _(`Sone ${zoneName}`, `Zone ${zoneName}`, `Sone ${zoneName}`),
    a11yLabelPrefixSingle: _('Valgt sone:', 'Selected zone:', 'Vald sone:'),
    a11yLabelPrefixMultiple: _(
      'Valgte soner:',
      'Selected zones:',
      'Valde soner:',
    ),
    a11yHint: _(
      'Aktivér for å velge soner',
      'Activate to select zones',
      'Aktivér for å velje soner',
    ),
  },
  productSelection: {
    title: _('Velg billett', 'Select a ticket', 'Vel bilett'),
    a11yTitle: _(
      'Aktiver for å velge billett',
      'Activate to select ticket',
      'Aktivér for å velje bilett',
    ),
  },
  travellerSelection: {
    title_single: _('Velg reisende', 'Select a traveller', 'Vel ein reisande'),
    title_multiple: _('Velg reisende', 'Select travellers', 'Vel reisande'),
    a11yLabelPrefixSingle: _(
      'Valgt reisende:',
      'Selected traveller:',
      'Vald reisande:',
    ),
    a11yLabelPrefixMultiple: _(
      'Valgte reisende:',
      'Selected travellers:',
      'Valde reisande:',
    ),
    a11yHint: _(
      'Aktiver for å velge reisende',
      'Activate to select traveller',
      'Aktivér for å velje reisande',
    ),
    travellers_title: (numberOfTravellers: number) =>
      _(
        `${numberOfTravellers} reisende`,
        `${numberOfTravellers} travellers`,
        `${numberOfTravellers} reisande`,
      ),
  },
  travellerSelectionSheet: {
    title: _('Reisende', 'Travellers', 'Reisande'),
    close: _('Lukk', 'Close', 'Lukk'),
    confirm: _('Bekreft valg', 'Confirm choice', 'Stadfest val'),
  },
  startTime: {
    title: _(
      'Velg oppstartstidspunkt',
      'Select start time',
      'Vel starttidspunkt',
    ),
    now: _('Oppstart nå', 'Start now', 'Start no'),
    later: _('Senere', 'Later', 'Seinare'),
    a11yLaterHint: _(
      'Aktiver for å velge et senere oppstartstidspunkt',
      'Activate to select a later start time',
      'Aktivér for å velje eit seinare starttidspunkt',
    ),
    a11yNowHint: _(
      'Aktiver for å sette oppstartstidspunkt til nå.',
      'Activate to set ticket start time to now.',
      'Aktivér for å sette starttidspunkt til no',
    ),
  },
  summary: {
    destinations: (from?: string, to?: string) =>
      _(
        `Fra ${from || 'ukjent'}, til ${to || 'ukjent'}`,
        `From ${from || 'unknown'}, to ${to || 'unknown'}`,
      ),
    price: (priceString: string) =>
      _(
        `Totalt ${priceString} kr`,
        `Total ${priceString} kr`,
        `Totalt ${priceString} kr`,
      ),
    messageInZone: _(
      `Gjelder for buss/trikk i valgte soner`,
      `Applies for bus/tram in selected zones`,
      `Gjeld for buss/trikk i valde soner`,
    ),
    messageAppliesFor: (text: string) =>
      _(`Gjelder for ${text}`, `Applies for ${text}`, `Gjeld for ${text}`),
    button: _('Til betaling', 'To payment', 'Til betaling'),
  },
  flexDiscount: {
    heading: _('Rabatt', 'Discount', 'Rabatt'),
    expandableLabel: _(
      'Din rabatt og pris',
      'Your discount and price',
      'Din rabatt og pris',
    ),
    description: _(
      'Enkeltbillett voksen har rabatt i Sone A basert på antall kjøp de siste 14 dagene når du er med i pilot for Fleksibel billett.',
      "Adult single tickets get discounts in zone A based on the number of purchases in the last 14 days when you're participating in the Flexible ticket pilot.",
      'Enkeltbillett voksen har rabatt i Sone A basert på talet på kjøp dei siste 14 dagane når du er med på prøveordninga for Fleksibel billett.',
    ),
    per: (userProfileName: string) =>
      _(
        `Pr. ${userProfileName}`,
        `Per ${userProfileName}`,
        `Per ${userProfileName}`,
      ),
    discountPercentage: (discount: string) =>
      _(
        `${discount} % rabatt`,
        `${discount} % discount`,
        `${discount} % rabatt`,
      ),
    link: _(
      'Les mer og se rabattabell',
      'Read more and see discount details',
      'Les meir og sjå rabattabell',
    ),
    a11yHint: _(
      'Aktivér for å lese mer om rabatt på fleksibel billett på ekstern side',
      'Activate to read more about the details for discount on flexible tickets (external content)',
      'Aktiver for å lese meir om rabatt på fleksibel billett på ekstern side',
    ),
  },
};

export default orgSpecificTranslations(PurchaseOverviewTexts, {
  nfk: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din profil.',
      'When traveling, you need to bring the travel card registered on your profile.',
      'Når du er på reise, må du ha med deg reisekortet som er registrert på profilen din.',
    ),
    summary: {
      messageInZone: _(
        `Gjelder for buss i valgte soner`,
        `Applies for bus in selected zones`,
        `Gjeld for buss i valde soner`,
      ),
    },
  },
  fram: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din bruker.',
      'When traveling, you need to bring the travel card registered on your user.',
      'Når du er på reise, må du ha med deg reisekortet som er registrert på brukeren din.',
    ),
    summary: {
      messageInZone: _(
        `Gjelder for buss i valgte soner`,
        `Applies for bus in selected zones`,
        `Gjeld for buss i valde soner`,
      ),
    },
  },
});
