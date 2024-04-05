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
      'Aktivér for å velje billettype',
    ),
  },
  warning: _(
    'Når du er ute og reiser må du ha med t:kortet som er registrert på din profil.',
    'When traveling, you need to bring the t:card registered on your profile.',
    'Når du er ute og reiser må du ha med t:kortet som er registrert på profilen din.',
  ),
  fromToLabel: {
    from: _('Fra', 'From', 'Frå'),
    to: _('Til', 'To', 'Til'),
  },
  stopPlaces: {
    harborSelection: {
      select: _('Velg kaier', 'Select harbors', 'Vel kaier'),
      noneSelected: {
        text: _('Ingen kai valgt', 'No harbor selected', 'Inga kai valt'),
        a11yLabel: _('Ingen kai valgt', 'No harbor selected', 'Inga kai valt'),
      },
      from: {
        a11yLabel: (harbor?: string) =>
          _(
            `Valgt avreisekai: ${harbor ?? 'Ingen kai valgt'}`,
            `Selected departure harbor: ${harbor ?? 'No harbor selected'}`,
            `Valt avreisekai: ${harbor ?? 'Inga kai valt'}`,
          ),
        a11yHint: _(
          'Aktivér for å velge avreisekai',
          'Activate to select departure harbor',
          'Aktivér for å velje avreisekai',
        ),
      },
      to: {
        a11yLabel: (harbor?: string) =>
          _(
            `Valgt ankomstkai: ${harbor ?? 'Ingen kai valgt'}`,
            `Selected destination harbor: ${harbor ?? 'No harbor selected'}`,
            `Valt framkomstkai: ${harbor ?? 'Inga kai valt'}`,
          ),
        a11yHint: _(
          'Aktivér for å velge ankomstkai',
          'Activate to select destination harbor',
          'Aktivér for å velje framkomstkai',
        ),
      },
    },
  },
  zones: {
    title: {
      single: {
        text: _(
          'Velg holdeplass/sone (kun én)',
          'Select stop/zone (only one)',
          'Vel haldeplass/sone (berre éin)',
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
      none: {
        text: _(
          'Sone',
          'Zone',
          'Sone'
        ),
        a11yLabel: _(
          'Sone',
          'Zone',
          'Sone'
        )
      }
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
    title: _('Velg billett', 'Select a ticket', 'Vel billett'),
    descriptionToggle: {
      label: _('Vis info', 'Show info', 'Vis info'),
      a11yLabel: _(
        'Vis informasjon om produkter',
        'Show information about products',
        'Vis informasjon om produkt',
      ),
    },
    a11yTitle: _(
      'Aktiver for å velge billett',
      'Activate to select ticket',
      'Aktivér for å velje billett',
    ),
  },
  travellerSelection: {
    titleSingle: _('Velg reisende', 'Select a traveller', 'Vel ein reisande'),
    titleMultiple: _('Velg reisende', 'Select travellers', 'Vel reisande'),
    titleNotSelectable: _('Reisende', 'Traveller', 'Reisande'),
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
    a11yLabelPrefixNotSelectable: _('Reisende:', 'Traveller:', 'Reisande:'),
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
    later: _('Oppstart senere', 'Start later', 'Oppstart seinare'),
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
    price: (priceString: string) =>
      _(
        `Totalt ${priceString} kr`,
        `Total ${priceString} kr`,
        `Totalt ${priceString} kr`,
      ),
    free: _(
      'Denne reisen er gratis og krever ingen billett.',
      'This trip is free and does not require a ticket.',
      'Denne reisa er gratis og krev ingen billett.',
    ),
    messageRequiresMobile: _(
      `Gjelder kun på mobil`,
      `Only available on phone`,
      `Gjeld kun på mobil`,
    ),
    button: {
      payment: _('Til betaling', 'To payment', 'Til betaling'),
      sendToOthers: _('Gå videre', 'Continue', 'Gå vidare'),
    },
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
      'Enkeltbillett vaksen har rabatt i Sone A basert på talet på kjøp dei siste 14 dagane når du er med på prøveordninga for Fleksibel billett.',
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
  onBehalfOf: {
    sectionTitle: _('Kjøp til andre', 'Buy for others', 'Kjøp til andre'),
    sectionSubText: _(
      'Den du kjøper billett til, må være innlogget i AtB-appen for å få billetten.',
      'The person you buy a ticket for, must be logged in to the AtB app to get the ticket.',
      'Den du kjøper billett til, må vere logga inn i AtB-appen for å få billetten.',
    ),
    sendToOthersText: _(
      'Sendes til noen andre',
      'Sending to someone else',
      'Sendast til nokon andre',
    ),
  },
  ticketInformation: {
    button: _('Om billetten', 'About the ticket', 'Om billetten'),
    informationDetails: {
      title: _('Om billetten', 'About the ticket', 'Om billetten'),
      descriptionHeading: _(
        'Billettbeskrivelse',
        'Ticket description',
        'Billettbeskriving',
      ),
      tipsInformation: _(
        'Generelt om billetter',
        'About tickets in general',
        'Generelt om billettar',
      ),
    },
  },
};

export default orgSpecificTranslations(PurchaseOverviewTexts, {
  nfk: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din profil.',
      'When traveling, you need to bring the travel card registered on your profile.',
      'Når du er på reise, må du ha med deg reisekortet som er registrert på profilen din.',
    ),
    onBehalfOf: {
      sectionSubText: _(
        'Den du kjøper billett til, må være innlogget i Reis-appen for å få billetten.',
        'The person you buy a ticket for, must be logged in to the Reis app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i Reis-appen for å få billetten.',
      ),
    },
  },
  fram: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din bruker.',
      'When traveling, you need to bring the travel card registered on your user.',
      'Når du er på reise, må du ha med deg reisekortet som er registrert på brukeren din.',
    ),
    onBehalfOf: {
      sectionSubText: _(
        'Den du kjøper billett til, må være innlogget i FRAM-appen for å få billetten.',
        'The person you buy a ticket for, must be logged in to the FRAM app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i FRAM-appen for å få billetten.',
      ),
    },
  },
});
