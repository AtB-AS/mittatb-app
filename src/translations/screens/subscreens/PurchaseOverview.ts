import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const PurchaseOverviewTexts = {
  travelSearchInfo: _(
    'Vi har fylt inn oppstartstidspunkt og holdeplasser for din reise. Vennligst sjekk at detaljene stemmer.',
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
    productUnavailable: {
      title: (productName: string) =>
        _(
          `${productName} er ikke gyldig på dette tidspunktet`,
          `${productName} is not valid at this time`,
          `${productName} er ikkje gyldig på dette tidspunktet`,
        ),
      message: _(
        `Du må velge en annen billett fra billettoversikten.`,
        `You need to choose a different ticket from the ticket overview.`,
        `Du må velje ein annan billett frå billettoversikta.`,
      ),
    },
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
        text: _('Holdeplass/sone', 'Stop/zone', 'Haldeplass/sone'),
        a11yLabel: _(
          'Velg holdeplass eller sone (kun én)',
          'Select stop or zone (only one)',
          'Vel haldeplass eller sone (berre éin)',
        ),
      },
      multiple: {
        text: _('Holdeplass/sone', 'Stop/zone', 'Haldeplass/sone'),
        a11yLabel: _(
          'Velg holdeplass eller soner',
          'Select stop or zones',
          'Vel haldeplassar eller soner',
        ),
      },
      none: {
        text: _('Sone', 'Zone', 'Sone'),
        a11yLabel: _('Sone', 'Zone', 'Sone'),
      },
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
    titleSingle: _('Reisende', 'Traveller', 'Reisande'),
    titleMultiple: _('Reisende', 'Travellers', 'Reisande'),
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
    confirm: _('Bekreft valg', 'Confirm selection', 'Bekreft valg'),
  },
  startTime: {
    title: _('Oppstartstidspunkt', 'Start time', 'Starttidspunkt'),
    now: _('Nå', 'Now', 'No'),
    laterTime: (time: string) =>
      _(`Oppstart ${time}`, `Start ${time}`, `Start ${time}`),
    laterOption: _('Senere', 'Later', 'Seinare'),
    a11yLabel: (time?: string) =>
      _(
        `Valgt oppstartstidspunkt: ${time || 'nå'}`,
        `Selected start time:  ${time || 'now'}`,
        `Vald starttidspunkt:  ${time || 'no'}`,
      ),
    a11yLaterHint: _(
      'Aktiver for å velge oppstartstidspunkt',
      'Activate to select start time',
      'Aktivér for å velje starttidspunkt',
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
    button: {
      payment: _('Til betaling', 'To payment', 'Til betaling'),
      sendToOthers: _('Velg mottaker', 'Select recipient', 'Vel mottakar'),
    },
    ordinaryPriceA11yLabel: (priceString: string) =>
      _(
        `Ordinær pris ${priceString} kr`,
        `Ordinary price ${priceString} kr`,
        `Ordinær pris ${priceString} kr`,
      ),
  },
  flexDiscount: {
    heading: _('Pris', 'Price', 'Pris'),
    expandableLabel: _('Min pris', 'My price', 'Min pris'),
    description: _(
      'Min pris på enkeltbillett voksen baseres på antall kjøpte billetter de siste 14 dagene. Etter tre kjøpte billetter får du en litt lavere pris.',
      'My price on single tickets for adult is based on the number of tickets you have bought in the last 14 days. After three purchased tickets, you get a slightly lower price.',
      'Min pris på enkeltbillett vaksen er basert på antall kjøpte billettar dei siste 14 dagane. Etter tre kjøpte billettar får du ein litt lågare pris.',
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
    link: _('Les mer på atb.no', 'Read more on atb.no', 'Les meir på atb.no'),
    a11yHint: _(
      'Aktivér for å lese mer på ekstern side',
      'Activate to read more on external page',
      'Aktiver for å lese meir på ekstern side',
    ),
  },
  onBehalfOf: {
    sectionTitle: _('Kjøp til andre', 'Buy for others', 'Kjøp til andre'),

    sectionSubText: _(
      'Den du kjøper billett til, må være innlogget i AtB-appen for å få billetten.',
      'The person you buy a ticket for, must be logged in to the AtB app to recieve the ticket.',
      'Den du kjøper billett til, må vere logga inn i AtB-appen for å få billetten.',
    ),

    sendToOthersText: _(
      'Send billetten til noen andre',
      'Send the ticket to someone else',
      'Send biletten til nokon andre',
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
    flexDiscount: {
      link: _(
        'Les mer på reisnordland.no',
        'Read more on reisnordland.no',
        'Les meir på reisnordland.no',
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
    flexDiscount: {
      link: _(
        'Les mer på frammr.no',
        'Read more on frammr.no',
        'Les meir på frammr.no',
      ),
    },
  },
  troms: {
    onBehalfOf: {
      sectionSubText: _(
        'Den du kjøper billett til, må være innlogget i Svipper-appen for å få billetten.',
        'The person you buy a ticket for, must be logged in to the Svipper app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i Svipper-appen for å få billetten.',
      ),
    },
    flexDiscount: {
      link: _(
        'Les mer på fylkestrafikk.no',
        'Read more on fylkestrafikk.no',
        'Les meir på fylkestrafikk.no',
      ),
    },
  },
});
