import {translation as _} from '../../commons';
const SelectTravelTokenTexts = {
  travelToken: {
    header: {
      title: _(
        'Bruk billett på t:kort / mobil',
        'Use ticket on t:card / phone',
      ),
    },
    changeTokenButton: _(
      'Bytt mellom t:kort / mobil',
      'Switch between t:card / phone',
    ),
    faq: {
      title: _('Ofte stilte spørsmål', 'Frequently asked questions'),
    },
    faqs: [
      {
        question: _(
          'Hva skjer om jeg mister t:kortet eller mobilen?',
          'What happens if I lose my t:card or phone?',
        ),
        answer: _(
          'Du kan enkelt velge å bruke billetten din på et annet t:kort eller mobil. Det gjør du på **Min profil**.',
          'You can easily head over to **My profile** to switch and use your ticket on another t:card or phone.',
        ),
      },
      {
        question: _(
          'Kan jeg bruke billetten på både t:kort og mobil samtidig?',
          'Can I use the ticket on both t:card and phone at the same time?',
        ),
        answer: _(
          'Nei. Billetten kan bare brukes på en dings om gangen, og billetten kan ikke deles med andre.',
          'No. You can only use the ticket on one gadget at a time and the ticket can not be shared with others.',
        ),
      },
      {
        question: _(
          'Kan jeg reise uten t:kort eller mobil?',
          'Can I travel without my t:card or phone?',
        ),
        answer: _(
          'Nei. Du må alltid ha med deg den dingsen du har valgt å bruke billetten på.',
          'No. You must always bring the gadget you have chosen to use your ticket on.',
        ),
      },
      {
        question: _(
          `Har du flere spørsmål om billettkjøp?`,
          `Do you have any other questions about ticket purchases?`,
        ),
        answer: _(
          `Se flere måter å kontakte oss på atb.no/kontakt`,
          `See how to contact us at atb.no/en/contact`,
        ),
      },
    ],
  },
  toggleToken: {
    title: _('Bytt mellom t:kort / mobil', 'Switch between t:card / phone'),
    radioBox: {
      tCard: {
        title: _('t:kort', 't:card'),
        description: _(
          'Les av t:kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          'Validate your t:card at the bus stop or on board. The card will be scanned in a ticket inspection.',
        ),
        a11yLabel: _(
          't:kort. Les av t-kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          't:card. Validate your t:card at the bus stop or on board. The card will be scanned in a ticket inspection.',
        ),
        a11yHint: _('Aktivér for å velge t:kort.', 'Activate to select t:card'),
      },
      phone: {
        title: _('Mobil', 'Phone'),
        description: _(
          'Gå om bord med mobilen. Mobilen vises frem ved kontroll.',
          'Board with your phone. Present the phone for ticket inspection.',
        ),
        a11yLabel: _(
          'Mobil. Gå om bord med mobilen. Mobilen vises frem ved kontroll.',
          'Board with your phone. Present the phone for ticket inspection.',
        ),
        a11yHint: _('Aktivér for å velge mobil.', 'Activate to select phone'),
        selection: {
          heading: _('Velg enhet', 'Select device'),
          thisDeviceSuffix: _(' (denne enheten)', ' (this device)'),
        },
      },
    },
    saveButton: _('Lagre valg', 'Confirm selection'),
    errorMessage: _('Noe gikk galt', 'Something went wrong'),
    noTravelCard: _(
      'Du har ikke et t:kort registrert. Hvis du ønsker å bruke t:kort kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.atb.no).',
      'You have no t:card registered, If you wish to use t:card as travel token you may add this to your profile in the [webshop](https://nettbutikk.atb.no).',
    ),
    noMobileToken: _(
      'Vi forsøker å klargjøre din mobil til å kunne bruke billettene på den, men det ser ut som det tar litt tid. Du kan sjekke om du har nettilgang og hvis ikke så vil appen forsøke på nytt neste gang du får tilgang.',
      `We're trying to get your phone ready for ticket usage, but it seems like it's taking some time. Check that your device is connected to the internet, if not we'll try again once the internet connection is restored.`,
    ),
    hasCarnet: _(
      'Du har et klippekort. Foreløpig fungerer ikke klippekort på mobil. Hvis du bytter til mobil vil du ikke kunne bruke klippekortet ditt.',
      `You have an active punch card. Currently punch cards cannot be activated using a phone. If you change to a phone now, you will not be able to use your punch card.`,
    ),
    unnamedDevice: _('Enhet uten navn', 'Unnamed device'),
  },
};
export default SelectTravelTokenTexts;
