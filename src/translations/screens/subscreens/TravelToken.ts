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
        question: _(
          'Hva skjer om jeg mister mobilen eller t:kortet?',
          'What happens if I lose my mobile or t:card?',
        ),
        answer: _(
          'Du kan enkelt velge å bruke billetten din på et annet t:kort eller mobil. Det gjør du på **Min profil**.',
          'You can easily head over to **My profile** to switch and use your ticket on another t:card or mobile.',
        ),
      },
      {
        question: _(
          'Kan jeg bruke billetten på både t:kort og mobil samtidig?',
          'Can I use the ticket on both t:card and mobile at the same time?',
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
          'Nei. Du mpå alltid ha med deg den dingsen du har valgt å bruke billetten på.',
          'No. You must always bring the gadget you gave chosen to use your ticket on.',
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
    title: _('Bytt mellom mobil / t:kort', 'Switch between mobile / t:card'), // TODO
    radioBox: {
      tCard: {
        title: _('T:kort', 'T:card'),
        description: _(
          'Les av t:kortet ditt på holdeplass eller ombord. Kortet leses av ved kontroll.',
          'TODO', // TODO
        ),
        a11yLabel: _(
          'T:kort. Les av t-kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          'TODO', // TODO
        ),
        a11yHint: _('Aktivér for å velge t:kort.', 'Activate to select t:card'),
      },
      phone: {
        title: _('Mobil', 'Phone'),
        description: _(
          'Gå ombord med mobilen. Mobilen vises frem ved kontroll.',
          'TODO', // TODO
        ),
        a11yLabel: _(
          'Mobil. Gå ombord med mobilen. Mobilen vises frem ved kontroll.',
          'TODO', // TODO
        ),
        a11yHint: _(
          'Aktivér for å velge mobil.',
          'TODO', // TODO
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
    unnamedDevice: _('Enhet uten navn', 'Unnamed device'),
  },
};
export default SelectTravelTokenTexts;
