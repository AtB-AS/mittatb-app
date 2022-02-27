import {translation as _} from '../../commons';
const SelectTravelTokenTexts = {
  travelToken: {
    header: {
      title: _(
        'Bruk billett på mobil / t:kort',
        'Use ticket on mobile / t:card',
      ),
    },
    changeTokenButton: _(
      'Bytt mellom mobil / t:kort',
      'Switch between mobile / t:card',
    ),
    faq: {
      title: _('Ofte stilte spørsmål', 'Frequently asked questions'),
    },
    faqs: [
      {
        question: _('Hva om jeg mister mobilen eller t:kortet?', ''), // TODO
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // TODO
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // TODO
        ),
      },
      {
        question: _('Kan jeg reise med t:kort og mobil samtidig?', ''), // TODO
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // TODO
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // TODO
        ),
      },
      {
        question: _('Kan jeg reise uten mobil eller t:kort?', ''), // TODO
        answer: _(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // TODO
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', // TODO
        ),
      },
    ],
    errorMessages: {
      tokensNotLoaded: _(
        'Vi får ikke hentet ut informasjon om enten t:kortet eller mobilen din. Sjekk at du har tilgang på nett der du er.',
        '', // TODO
      ),
      emptyTokens: _(
        'Vi finner ingen t:kort eller mobiler tilknyttet profilen din. Sjekk at du har tilgang på nett.' +
          '\n\n' +
          'Hvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.' +
          '\n\n' +
          'Om problemet vedvarer kan du ta kontakt med AtB kundesenter.',
        '', // TODO
      ),
      noInspectableToken: _(
        'Du har ikke valgt å bruke billett på enten t:kort eller mobil. Gå til *Bytt mellom mobil / t:kort* for å velge.',
        '', // TODO
      ),
    },
  },
  toggleToken: {
    title: _('Bytt mellom mobil / t:kort', 'Switch between mobile / t:card'), // TODO
    radioBox: {
      tCard: {
        title: _('T:kort', 'T:card'),
        description: _(
          'Les av t:kortet ditt på holdeplass eller ombord. Kortet leses av ved kontroll.',
          '', // TODO
        ),
        a11yLabel: _(
          'T:kort. Les av t-kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          '', // TODO
        ),
        a11yHint: _('Aktivér for å velge t:kort.', 'Activate to select t:card'),
      },
      phone: {
        title: _('Mobil', 'Phone'),
        description: _(
          'Gå ombord med mobilen. Mobilen vises frem ved kontroll.',
          '', // TODO
        ),
        a11yLabel: _(
          'Mobil. Gå ombord med mobilen. Mobilen vises frem ved kontroll.',
          'Phone. ', // TODO
        ),
        a11yHint: _(
          'Aktivér for å velge mobil.',
          '', // TODO
        ),
        selection: {
          heading: _('Velg enhet', 'Select device'), // TODO
          thisDeviceSuffix: _(' (denne enheten)', ' (this device)'),
        },
      },
    },
    saveButton: _('Lagre valg', 'Confirm selection'), // TODO
    errorMessage: _('Noe gikk galt', 'Something went wrong'), // TODO
    noTravelCard: _(
      'Du har ikke et t:kort registrert. Hvis du ønsker å bruke t:kort kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.atb.no).', // TODO
      'You have no t:card registered, If you wish to use t:card as travel token you may add this to your profile in the [webshop](https://nettbutikk.atb.no).',
    ),
    noMobileToken: _(
      'Vi forsøker å klargjøre din mobil til å kunne bruke billettene på den, men det ser ut som det tar litt tid. Du kan sjekke om du har nettilgang og hvis ikke så vil appen forsøke på nytt neste gang du får tilgang.', // TODO
      'We are trying to make your mobile phone ready to be used for the tickets, but it seems it is taking some time. Check that your device is connected to the Internet and if not the phone will try again when the Internet connection is back.',
    ),
  },
};
export default SelectTravelTokenTexts;
