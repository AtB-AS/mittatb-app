import {translation as _} from '../../commons';
const SelectTravelTokenTexts = {
  travelToken: {
    header: {
      title: _('Mitt reisebevis', 'My travel token'),
    },
    activeToken: {
      title: _('Aktivt reisebevis', 'Active travel token'),
      type: {
        tcard: {
          title: _('T:kort', 'T:card'),
          description: _(
            'Ta med deg t:kortet når du er ute og reiser.',
            'Bring your t:card when you are travelling.',
          ),
          a11yLabel: _(
            'Ditt aktive reisebevis er t:kort. Ta med deg t:kortet når du er ute og reiser.',
            'Your active travel token is t:card. Bring your t:card when you are travelling',
          ),
        },
        mobile: {
          description: _(
            'Ta med deg mobilen når du er ute og reiser.',
            'Bring your mobile phone when you are travelling.',
          ),
          a11yLabel: (deviceName: string) =>
            _(
              `Ditt aktive reisebevis er mobilen ${deviceName}. Ta med deg mobilen når du er ute og reiser.`,
              `Your active travel token is the mobile phone ${deviceName}. Bring your phone when you are travelling`,
            ),
        },
      },
      info: _(
        'Du kan ha ett gyldig reisebevis til enhver tid.',
        'You can have one valid travel token at a time.',
      ),
    },
    changeTokenButton: _('Endre reisebevis', 'Change travel token'),
    faq: {
      title: _('Ofte stilte spørsmål', 'Frequently asked questions'),
    },
    faqs: [
      {
        question: _('Hva er et reisebevis?', 'What is a travel token?'),
        answer: _(
          'Et reisebevis kan være et t:kort eller en spesifikk mobiltelefon. Det er du bruker for å kunne fremvise gyldig billett.',
          'A travel token may be a t:card or a specific mobile phone. It is used for presenting a valid ticket.',
        ),
      },
      {
        question: _(
          'Hvor mange reisebevis kan jeg ha?',
          'How many travel tokens can I own?',
        ),
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ),
      },
      {
        question: _(
          'Hvor ofte kan jeg bytte?',
          'How frequently can I switch tokens?',
        ),
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ),
      },
      {
        question: _(
          'Kan jeg reise uten mitt reisebevis?',
          'Can I travel without my travel token?',
        ),
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ),
      },
      {
        question: _('Hva om jeg mister mobilen?', 'What if I lose my phone?'),
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ),
      },
    ],
    errorMessages: {
      tokensNotLoaded: _(
        'Får ikke lastet inn reisebevis. Du kan sjekke om du har nettilgang, eller så kan det være en feil som har oppstått',
        'Could not load travel tokens. Check that your device is connected to the Internet and try again.',
      ),
      emptyTokens: _(
        'Vi forsøker å opprette et reisebevis til deg, men det ser ut som det tar litt tid. Du kan sjekke om du har nettilgang og hvis ikke så vil appen forsøke å opprette det neste gang du får tilgang.' +
          '\n\n' +
          'Hvis du ønsker å bruke t:kort som reisebevis i stedet kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.atb.no).',
        'We are trying to create a travel token, but it seems it is taking some time. Check that your device is connected to the Internet and if not the phone will try to create a travel token for you when the Internet connection is back.' +
          '\n\n' +
          'If you wish to use t:card as travel token instead you may add this to your profile in the [webshop](https://nettbutikk.atb.no).',
      ),
      noInspectableToken: _(
        'Reisebevis er ikke valgt. Gå til **Endre reisebevis** for å velge.',
        'No travel token selected. Go to **Change travel token** to select.' +
          '\n\n' +
          'If you wish to use t:card as travel token instead you may add this to your profile in the webshop.',
      ),
    },
  },
  toggleToken: {
    title: _('Mitt reisebevis', 'My travel token'),
    radioBox: {
      tCard: {
        title: _('T:kort', 'T:card'),
        description: _(
          'Les av t:kortet ditt på holdeplass eller ombord. Kortet leses av ved kontroll.',
          'Read your t:card at the stop place or when boarding. The card will be read during ticket inspection.',
        ),
        a11yLabel: _(
          'T-kort. Les av t-kortet ditt på holdeplass eller ombord. Kortet leses av ved kontroll.',
          'T-card. Read your t-card at the stop place or when boarding. The card will be read during ticket inspection.',
        ),
        a11yHint: _(
          'Aktivér for å velge t-kort som ditt reisebevis.',
          'Activate to select t:card as your travel token',
        ),
      },
      phone: {
        title: _('Mobil', 'Phone'),
        description: _(
          'Gå ombord med mobilen. Mobilen vises frem ved kontroll.',
          'Board with your mobile phone. The mobile phone must be presented during ticket inspection.',
        ),
        a11yLabel: _(
          'Mobil. Gå ombord med mobilen. Mobilen vises frem ved kontroll.',
          'Phone. Board with your mobile phone. The mobile phone must be presented during ticket inspection.',
        ),
        a11yHint: _(
          'Aktivér for å velge mobil som ditt reisebevis.',
          'Activate to select mobile phone as your travel token',
        ),
        selection: {
          heading: _('Velg enhet', 'Select device'),
        },
      },
    },
    saveButton: _('Lagre valg', 'Confirm selection'),
    errorMessage: _('Noe gikk galt', 'Something went wrong'),
    noTravelCard: _(
      'Du har ikke et t:kort registrert. Hvis du ønsker å bruke t:kort som reisebevis kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.atb.no).',
      'You have no t:card registered, If you wish to use t:card as travel token you may add this to your profile in the [webshop](https://nettbutikk.atb.no).',
    ),
    noMobileToken: _(
      'Vi forsøker å opprette et reisebevis til deg på mobilen, men det ser ut som det tar litt tid. Du kan sjekke om du har nettilgang og hvis ikke så vil appen forsøke å opprette det neste gang du får tilgang.',
      'We are trying to create a travel token for you on this mobile phone, but it seems it is taking some time. Check that your device is connected to the Internet and if not the phone will try to create a travel token for you when the Internet connection is back.',
    ),
  },
};
export default SelectTravelTokenTexts;
