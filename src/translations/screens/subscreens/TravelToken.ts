import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const SelectTravelTokenTexts = {
  travelToken: {
    header: {
      title: _(
        'Bruk billett på t:kort / mobil',
        'Use ticket on t:card / phone',
      ),
      titleWithoutTravelcard: _('Bruk billett mobil', 'Use ticket on phone'),
    },
    changeTokenButton: _(
      'Bytt mellom t:kort / mobil',
      'Switch between t:card / phone',
    ),
    changeTokenWithoutTravelcardButton: _(
      'Bytt mellom mobiler',
      'Switch between phones',
    ),
    toggleCountLimitInfo: (
      remainingToggleCount: number,
      countRenewalDate: string,
    ) =>
      _(
        `Du har ${remainingToggleCount} bytter igjen.\nFlere bytter blir tilgjengelig ${countRenewalDate}.`,
        `You have ${remainingToggleCount} switches left. \nMore will be available on ${countRenewalDate}.`,
      ),
    oneToggleCountLeftInfo: (countRenewalDate: string) =>
      _(
        `Du har 1 bytte igjen.\nFlere bytter blir tilgjengelig ${countRenewalDate}.`,
        `You have 1 switch left. \nMore will be available on ${countRenewalDate}.`,
      ),
    zeroToggleCountLeftInfo: (countRenewalDate: string) =>
      _(
        `Du kan ikke bytte flere ganger.\nFlere bytter blir tilgjengelig ${countRenewalDate}.`,
        `You have no switches left. \nMore will be available on ${countRenewalDate}.`,
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
          'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil eller t:kort.',
          'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone or t:card.',
        ),
      },
      {
        question: _(
          'Kan jeg bruke billetten på både t:kort og mobil samtidig?',
          'Can I use the ticket on both t:card and mobile phone at the same time?',
        ),
        answer: _(
          'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
          'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
        ),
      },
      {
        question: _(
          'Kan jeg reise uten t:kort eller mobil?',
          'Can I travel without my t:card or phone?',
        ),
        answer: _(
          'Du må alltid ha med deg det t:kortet eller mobilen du har valgt å bruke billetten på.',
          'You must always travel with the t:card or mobile phone you have chosen to use the ticket on.',
        ),
      },
      {
        question: _(
          `Jeg får ikke logget inn i appen AtB med e-post`,
          `I can not log into the AtB app with e-mail`,
        ),
        answer: _(
          `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke t:kort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye brukerprofil. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny brukerprofil i appen.`,
          `It is not possible to log into the app with e-mail as of today. You can continue to use your t:card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user profile. You can contact customer service regarding a refund if you still want to create a new user profile in the app.`,
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
    faqsWithoutTravelcard: [
      {
        question: _(
          'Hva skjer om jeg mister mobilen?',
          'What happens if I lose my phone?',
        ),
        answer: _(
          'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil.',
          'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone.',
        ),
      },
      {
        question: _(
          'Kan jeg bruke billetten på flere mobiler samtidig?',
          'Can I use the ticket on several mobile phones at the same time?',
        ),
        answer: _(
          'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
          'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
        ),
      },
      {
        question: _(
          'Kan jeg reise uten mobil?',
          'Can I travel without my phone?',
        ),
        answer: _(
          'Du må alltid ha med deg det mobilen du har valgt å bruke billetten på.',
          'You must always travel with the mobile phone you have chosen to use the ticket on.',
        ),
      },
      {
        question: _(
          `Jeg får ikke logget inn i appen AtB med e-post`,
          `I can not log into the AtB app with e-mail`,
        ),
        answer: _(
          `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke t:kort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye brukerprofil. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny brukerprofil i appen.`,
          `It is not possible to log into the app with e-mail as of today. You can continue to use your t:card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user profile. You can contact customer service regarding a refund if you still want to create a new user profile in the app.`,
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
    tokenToggleFaq: {
      question: _(
        `Hvor mange ganger kan jeg bytte?`,
        `How many times can I switch?`,
      ),
      answer: (toggleMaxLimit: number) =>
        _(
          `Du kan bytte inntil ${toggleMaxLimit} ganger i måneden. Du får nye bytter den 1. hver måned. Merk at byttet må være fullført før du går om bord og du kan ikke bytte mens du reiser.`,
          `You can switch up to ${toggleMaxLimit} times a month. You get new switches on the 1st of every month. Note that the switch must be completed before boarding and you can not switch while travelling.`,
        ),
    },
  },
  toggleToken: {
    title: _('Bytt mellom t:kort / mobil', 'Switch between t:card / phone'),
    titleWithoutTravelcard: _('Bytt mellom mobiler', 'Switch between phones'),
    radioBox: {
      tCard: {
        title: _('t:kort', 't:card'),
        description: _(
          'Les av t:kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          'Validate your t:card at the bus stop or on board. The card will be scanned in a ticket inspection.',
        ),
        a11yLabel: _(
          't:kort. Les av t:kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
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
      'You have no t:card registered, if you wish to use t:card as travel token you may add this to your profile in the [webshop](https://nettbutikk.atb.no).',
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
export default orgSpecificTranslations(SelectTravelTokenTexts, {
  nfk: {
    travelToken: {
      header: {
        title: _(
          'Bruk billett på reisekort / mobil',
          'Use ticket on travel card / phone',
        ),
      },
      changeTokenButton: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
      ),
      faqs: [
        {
          question: _(
            'Hva skjer om jeg mister reisekortet eller mobilen?',
            'What happens if I lose my travel card or phone?',
          ),
          answer: _(
            'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil eller reisekort.',
            'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone or travel card.',
          ),
        },
        {
          question: _(
            'Kan jeg bruke billetten på både reisekort og mobil samtidig?',
            'Can I use the ticket on both travel card and mobile phone at the same time?',
          ),
          answer: _(
            'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
            'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
          ),
        },
        {
          question: _(
            'Kan jeg reise uten reisekort eller mobil?',
            'Can I travel without my travel card or phone?',
          ),
          answer: _(
            'Du må alltid ha med deg det reisekortet eller mobilen du har valgt å bruke billetten på.',
            'You must always travel with the travel card or mobile phone you have chosen to use the ticket on.',
          ),
        },
        {
          question: _(
            `Jeg får ikke logget inn i Reis-appen med e-post`,
            `I can not log into the Reis app with e-mail`,
          ),
          answer: _(
            `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke reisekort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye brukerprofil. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny brukerprofil i appen.`,
            `It is not possible to log into the app with e-mail as of today. You can continue to use your travel card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user profile. You can contact customer service regarding a refund if you still want to create a new user profile in the app.`,
          ),
        },
        {
          question: _(
            `Har du flere spørsmål om billettkjøp?`,
            `Do you have any other questions about ticket purchases?`,
          ),
          answer: _(
            `Se flere måter å kontakte oss på reisnordland.no/kontakt-oss`,
            `See how to contact us at reisnordland.com/contact-us`,
          ),
        },
      ],
    },
    toggleToken: {
      title: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
      ),
      radioBox: {
        tCard: {
          title: _('Reisekort', 'Travel card'),
          description: _(
            'Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
          ),
          a11yLabel: _(
            'reisekort. Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'travel card. Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
          ),
          a11yHint: _(
            'Aktivér for å velge reisekort.',
            'Activate to select travel card',
          ),
        },
      },
      noTravelCard: _(
        'Du har ikke et reisekort registrert. Hvis du ønsker å bruke reisekort kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.reisnordland.no/).',
        'You have no travel card registered, if you wish to use travel card as travel token you may add this to your profile in the [webshop](https://nettbutikk.reisnordland.no/).',
      ),
    },
  },
  fram: {
    travelToken: {
      header: {
        title: _(
          'Bruk billett på reisekort / mobil',
          'Use ticket on travel card / phone',
        ),
      },
      changeTokenButton: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
      ),
      faqs: [
        {
          question: _(
            'Hva skjer om jeg mister reisekortet eller mobilen?',
            'What happens if I lose my travel card or phone?',
          ),
          answer: _(
            'Billetten din ligger trygt lagret i Min bruker. Velg å bruke billetten på en annen mobil eller reisekort.',
            'Your ticket is safely stored in My user. Switch to use the ticket on another mobile phone or travel card.',
          ),
        },
        {
          question: _(
            'Kan jeg bruke billetten på både reisekort og mobil samtidig?',
            'Can I use the ticket on both travel card and mobile phone at the same time?',
          ),
          answer: _(
            'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
            'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
          ),
        },
        {
          question: _(
            'Kan jeg reise uten reisekort eller mobil?',
            'Can I travel without my travel card or phone?',
          ),
          answer: _(
            'Du må alltid ha med deg det reisekortet eller mobilen du har valgt å bruke billetten på.',
            'You must always travel with the travel card or mobile phone you have chosen to use the ticket on.',
          ),
        },
        {
          question: _(
            `Jeg får ikke logget inn i FRAM-appen med e-post`,
            `I can not log into the FRAM app with e-mail`,
          ),
          answer: _(
            `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke reisekort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye bruker. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny bruker i appen.`,
            `It is not possible to log into the app with e-mail as of today. You can continue to use your travel card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user. You can contact customer service regarding a refund if you still want to create a new user in the app.`,
          ),
        },
        {
          question: _(
            `Har du flere spørsmål om billettkjøp?`,
            `Do you have any other questions about ticket purchases?`,
          ),
          answer: _(
            `Se flere måter å kontakte oss på frammr.no/kontakt-oss`,
            `See how to contact us at en.frammr.no/contact-us`,
          ),
        },
      ],
      faqsWithoutTravelcard: [
        {
          question: _(
            'Hva skjer om jeg mister mobilen?',
            'What happens if I lose my phone?',
          ),
          answer: _(
            'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil.',
            'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone.',
          ),
        },
        {
          question: _(
            'Kan jeg bruke billetten på flere mobiler samtidig?',
            'Can I use the ticket on several mobile phones at the same time?',
          ),
          answer: _(
            'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
            'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
          ),
        },
        {
          question: _(
            'Kan jeg reise uten mobil?',
            'Can I travel without my phone?',
          ),
          answer: _(
            'Du må alltid ha med deg det mobilen du har valgt å bruke billetten på.',
            'You must always travel with the mobile phone you have chosen to use the ticket on.',
          ),
        },
        {
          question: _(
            `Jeg får ikke logget inn i FRAM-appen med e-post`,
            `I can not log into the FRAM app with e-mail`,
          ),
          answer: _(
            `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye bruker. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny bruker i appen.`,
            `It is not possible to log into the app with e-mail as of today. You can create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user. You can contact customer service regarding a refund if you still want to create a new user in the app.`,
          ),
        },
        {
          question: _(
            `Har du flere spørsmål om billettkjøp?`,
            `Do you have any other questions about ticket purchases?`,
          ),
          answer: _(
            `Se flere måter å kontakte oss på frammr.no/kontakt-oss`,
            `See how to contact us at en.frammr.no/contact-us`,
          ),
        },
      ],
    },
    toggleToken: {
      title: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
      ),
      radioBox: {
        tCard: {
          title: _('Reisekort', 'Travel card'),
          description: _(
            'Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
          ),
          a11yLabel: _(
            'reisekort. Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'travel card. Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
          ),
          a11yHint: _(
            'Aktivér for å velge reisekort.',
            'Activate to select travel card',
          ),
        },
      },
      noTravelCard: _(
        'Du har ikke et reisekort registrert. Hvis du ønsker å bruke reisekort kan du legge til dette på din bruker i [nettbutikken](https://nettbutikk.frammr.no).',
        'You have no travel card registered, if you wish to use travel card as travel token you may add this to your profile in the [online store](https://nettbutikk.frammr.no).',
      ),
    },
  },
});
