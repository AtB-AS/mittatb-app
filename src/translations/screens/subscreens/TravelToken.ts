import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const SelectTravelTokenTexts = {
  travelToken: {
    header: {
      title: _(
        'Bruk billett på t:kort / mobil',
        'Use ticket on t:card / phone',
        'Bruk billett på t:kort / mobil',
      ),
      titleWithoutTravelcard: _(
        'Bruk billett på mobil',
        'Use ticket on phone',
        'Bruk billett på mobil',
      ),
    },
    changeTokenButton: _(
      'Bytt mellom t:kort / mobil',
      'Switch between t:card / phone',
      'Byt mellom t:kort / mobil',
    ),
    changeTokenWithoutTravelcardButton: _(
      'Bytt mellom mobiler',
      'Switch between phones',
      'Byt mellom mobilar',
    ),
    toggleCountLimitInfo: (
      remainingToggleCount: number,
      countRenewalDate: string,
    ) =>
      _(
        `Du har ${remainingToggleCount} bytter igjen.\nFlere bytter blir tilgjengelig ${countRenewalDate}.`,
        `You have ${remainingToggleCount} switches left. \nMore will be available on ${countRenewalDate}.`,
        `Du har ${remainingToggleCount} bytte igjen.\nFleire bytte blir tilgjengeleg ${countRenewalDate}.`,
      ),
    oneToggleCountLeftInfo: (countRenewalDate: string) =>
      _(
        `Du har 1 bytte igjen.\nFlere bytter blir tilgjengelig ${countRenewalDate}.`,
        `You have 1 switch left. \nMore will be available on ${countRenewalDate}.`,
        `Du har 1 bytte igjen.\nFleire bytte blir tilgjengeleg ${countRenewalDate}.`,
      ),
    zeroToggleCountLeftInfo: (countRenewalDate: string) =>
      _(
        `Du kan ikke bytte flere ganger.\nFlere bytter blir tilgjengelig ${countRenewalDate}.`,
        `You have no switches left. \nMore will be available on ${countRenewalDate}.`,
        `Du kan ikkje bytte fleire gongar.\nFleire bytte blir tilgjengeleg ${countRenewalDate}.`,
      ),
    faq: {
      title: _(
        'Ofte stilte spørsmål',
        'Frequently asked questions',
        'Ofte stilte spørsmål',
      ),
    },
    faqs: [
      {
        question: _(
          'Hva skjer om jeg mister t:kortet eller mobilen?',
          'What happens if I lose my t:card or phone?',
          'Kva skjer om eg mistar t:kortet eller mobilen?',
        ),
        answer: _(
          'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil eller t:kort.',
          'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone or t:card.',
          'Billetten din ligg trygt lagra i Min profil. Vel å bruke billetten på ein annan mobiltelefon eller t:kort.',
        ),
      },
      {
        question: _(
          'Kan jeg bruke billetten på både t:kort og mobil samtidig?',
          'Can I use the ticket on both t:card and mobile phone at the same time?',
          'Kan eg bruke billetten på både t:kort og mobil samtidig?',
        ),
        answer: _(
          'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
          'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
          'Nei, du kan berre bruke ein om gangen, og billetten kan ikkje delast med andre reisande.',
        ),
      },
      {
        question: _(
          'Kan jeg reise uten t:kort eller mobil?',
          'Can I travel without my t:card or phone?',
          'Kan eg reise utan t:kort eller mobil?',
        ),
        answer: _(
          'Du må alltid ha med deg det t:kortet eller mobilen du har valgt å bruke billetten på.',
          'You must always travel with the t:card or mobile phone you have chosen to use the ticket on.',
          'Du må alltid ha med deg det t:kortet eller mobiltelefonen du har valt å bruke billetten på.',
        ),
      },
      {
        question: _(
          `Jeg får ikke logget inn i appen AtB med e-post`,
          `I can not log into the AtB app with e-mail`,
          `Eg får ikkje logga inn i appen AtB med e-post`,
        ),
        answer: _(
          `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke t:kort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye brukerprofil. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny brukerprofil i appen.`,
          `It is not possible to log into the app with e-mail as of today. You can continue to use your t:card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user profile. You can contact customer service regarding a refund if you still want to create a new user profile in the app.`,
          `Det er ikkje mogleg å logga inn i appen med e-post per i dag. Du kan fortsetje å bruke t:kort eller opprette ein ny brukarprofil med mobilnummer som innlogging. Merk at billettane ikkje vil bli overført til den nye brukarprofilen. Du kan kontakte kundesenteret vedrørande refusjon dersom du likevel vil lage ein ny brukarprofil i appen.`,
        ),
      },
      {
        question: _(
          `Har du flere spørsmål om billettkjøp?`,
          `Do you have any other questions about ticket purchases?`,
          `Har du fleire spørsmål om billettkjøp?`,
        ),
        answer: _(
          `Se flere måter å kontakte oss på atb.no/kontakt`,
          `See how to contact us at atb.no/en/contact`,
          `Sjå fleire måtar å kontakte oss på atb.no/kontakt`,
        ),
      },
    ],
    faqsWithoutTravelcard: [
      {
        question: _(
          'Hva skjer om jeg mister mobilen?',
          'What happens if I lose my phone?',
          'Kva skjer om eg mistar mobilen?',
        ),
        answer: _(
          'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil.',
          'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone.',
          'Billetten din ligg trygt lagra i Min profil. Vel å bruke billetten på ein annan mobiltelefon.',
        ),
      },
      {
        question: _(
          'Kan jeg bruke billetten på flere mobiler samtidig?',
          'Can I use the ticket on several mobile phones at the same time?',
          'Kan eg bruke billetten på fleire mobilar samtidig?',
        ),
        answer: _(
          'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
          'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
          'Nei, du kan berre bruke ein om gangen, og billetten kan ikkje delast med andre reisande.',
        ),
      },
      {
        question: _(
          'Kan jeg reise uten mobil?',
          'Can I travel without my phone?',
          'Kan eg reise utan mobil?',
        ),
        answer: _(
          'Du må alltid ha med deg det mobilen du har valgt å bruke billetten på.',
          'You must always travel with the mobile phone you have chosen to use the ticket on.',
          'Du må alltid ha med deg mobilen du har valt å bruke billetten på.',
        ),
      },
      {
        question: _(
          `Jeg får ikke logget inn i appen AtB med e-post`,
          `I can not log into the AtB app with e-mail`,
          `Eg får ikkje logga inn i appen AtB med e-post`,
        ),
        answer: _(
          `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke t:kort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye brukerprofil. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny brukerprofil i appen.`,
          `It is not possible to log into the app with e-mail as of today. You can continue to use your t:card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user profile. You can contact customer service regarding a refund if you still want to create a new user profile in the app.`,
          `Det er ikkje mogleg å logge inn i appen med e-post per i dag. Du kan halde fram med å bruke t:kort eller opprette ein ny brukarprofil med mobilnummer som innlogging. Merk at billettane ikkje vil verte overførte til den nye brukarprofilen din. Du kan kontakte kundesenteret vedrørande refusjon viss du likevel vil lage ein ny brukarprofil i appen.`,
        ),
      },
      {
        question: _(
          `Har du flere spørsmål om billettkjøp?`,
          `Do you have any other questions about ticket purchases?`,
          `Har du fleire spørsmål om billettkjøp?`,
        ),
        answer: _(
          `Se flere måter å kontakte oss på atb.no/kontakt`,
          `See how to contact us at atb.no/en/contact`,
          `Sjå fleire måtar å kontakte oss på atb.no/kontakt`,
        ),
      },
    ],
    tokenToggleFaq: {
      question: _(
        `Hvor mange ganger kan jeg bytte?`,
        `How many times can I switch?`,
        `Kor mange gongar kan eg bytte?`,
      ),
      answer: (toggleMaxLimit: number) =>
        _(
          `Du kan bytte inntil ${toggleMaxLimit} ganger i måneden. Du får nye bytter den 1. hver måned. Merk at byttet må være fullført før du går om bord og du kan ikke bytte mens du reiser.`,
          `You can switch up to ${toggleMaxLimit} times a month. You get new switches on the 1st of every month. Note that the switch must be completed before boarding and you can not switch while travelling.`,
          `Du kan bytte inntil ${toggleMaxLimit} gongar i månaden. Du får nye bytter den 1. kvar månad. Merk at bytet må vere fullført før du går om bord og at du kan ikkje bytte mens du reiser.`,
        ),
    },
  },
  toggleToken: {
    title: _(
      'Bytt mellom t:kort / mobil',
      'Switch between t:card / phone',
      `Byt mellom t:kort / mobil`,
    ),
    titleWithoutTravelcard: _(
      'Bytt mellom mobiler',
      'Switch between phones',
      `Byt mellom mobiltelefonar`,
    ),
    radioBox: {
      tCard: {
        title: _('t:kort', 't:card', `t:kort`),
        description: _(
          'Les av t:kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          'Validate your t:card at the bus stop or on board. The card will be scanned in a ticket inspection.',
          `Les av t:kortet ditt på stoppestaden eller om bord. Kortet lesast av ved kontroll.`,
        ),
        a11yLabel: _(
          't:kort. Les av t:kortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
          't:card. Validate your t:card at the bus stop or on board. The card will be scanned in a ticket inspection.',
          `t:kort. Les av t:kortet ditt på stoppestaden eller om bord. Kortet lesast av ved kontroll.`,
        ),
        a11yHint: _(
          'Aktivér for å velge t:kort.',
          'Activate to select t:card',
          `Aktivér for å velje t:kort.`,
        ),
      },
      phone: {
        title: _('Mobil', 'Phone', `Mobil`),
        description: _(
          'Gå om bord med mobilen. Mobilen vises frem ved kontroll.',
          'Board with your phone. Present the phone for ticket inspection.',
          `Gå om bord med mobiltelefonen din. Mobilen visast fram ved kontroll.`,
        ),
        a11yLabel: _(
          'Mobil. Gå om bord med mobilen. Mobilen vises frem ved kontroll.',
          'Board with your phone. Present the phone for ticket inspection.',
          `Mobil. Gå om bord med mobiltelefonen din. Mobilen visast fram ved kontroll.`,
        ),
        a11yHint: _(
          'Aktivér for å velge mobil.',
          'Activate to select phone',
          `Aktivér for å velje mobil.`,
        ),
        selection: {
          heading: _('Velg enhet', 'Select device', `Vel eining`),
          thisDeviceSuffix: _(
            ' (denne enheten)',
            ' (this device)',
            ` (denne eininga)`,
          ),
        },
      },
    },
    saveButton: _('Lagre valg', 'Confirm selection', `Lagre valet`),
    errorMessage: _('Noe gikk galt', 'Something went wrong', `Noko gjekk gale`),
    noTravelCard: _(
      'Du har ikke et t:kort registrert. Hvis du ønsker å bruke t:kort kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.atb.no).',
      'You have no t:card registered, if you wish to use t:card as travel token you may add this to your profile in the [webshop](https://nettbutikk.atb.no).',
      `Du har ikkje eit t:kort registrert. Hvis du ønskjer å bruke t:kort kan du legge til dette på profilen din i [nettbutikken](https://nettbutikk.atb.no).`,
    ),
    noMobileToken: _(
      'Vi forsøker å klargjøre din mobil til å kunne bruke billettene på den, men det ser ut som det tar litt tid. Du kan sjekke om du har nettilgang og hvis ikke så vil appen forsøke på nytt neste gang du får tilgang.',
      `We're trying to get your phone ready for ticket usage, but it seems like it's taking some time. Check that your device is connected to the internet, if not we'll try again once the internet connection is restored.`,
      `Vi forsøker å klargjere mobilen din til å bruke billettane, men det ser ut til at det tar litt tid. Sjekk om du har tilkopling til internett, og hvis ikkje vil appen prøve på nytt neste gong du får tilkopling.`,
    ),
    hasCarnet: _(
      'Du har et klippekort. Foreløpig fungerer ikke klippekort på mobil. Hvis du bytter til mobil vil du ikke kunne bruke klippekortet ditt.',
      `You have an active punch card. Currently punch cards cannot be activated using a phone. If you change to a phone now, you will not be able to use your punch card.`,
      `Du har eit klippekort. Førebels fungerer ikkje klippekort på mobil. Hvis du byter til mobil vil du ikkje kunne bruke klippekortet ditt.`,
    ),
    notAllowedToUseTravelCardError: {
      title: _(
        'Kan ikke brukes på t:kort',
        'Cannot be used on t:cards',
        `Kan ikkje brukast på t:kort`,
      ),
      message: (ticketName: string) =>
        _(
          `Du har en aktiv ${ticketName}. Det er derfor ikke mulig å bytte til t:kort.`,
          `You have an active ${ticketName}. It is therefore not possible to switch to a t:card.`,
          `Du har ein aktiv ${ticketName}. Det vil difor ikkje vere mogleg å bytte til t:kort.`,
        ),
    },
    unnamedDevice: _('Enhet uten navn', 'Unnamed device', `Eining utan namn`),
  },
};
export default orgSpecificTranslations(SelectTravelTokenTexts, {
  nfk: {
    travelToken: {
      header: {
        title: _(
          'Bruk billett på reisekort / mobil',
          'Use ticket on travel card / phone',
          'Bruk billett på reisekort / mobil',
        ),
      },
      changeTokenButton: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
        'Byt mellom reisekort / mobil',
      ),
      faqs: [
        {
          question: _(
            'Hva skjer om jeg mister reisekortet eller mobilen?',
            'What happens if I lose my travel card or phone?',
            'Kva skjer om eg mistar reisekortet eller mobilen?',
          ),
          answer: _(
            'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil eller reisekort.',
            'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone or travel card.',
            'Billetten din ligg trygt lagra i Min profil. Vel å bruke billetten på ein annan mobil eller reisekort.',
          ),
        },
        {
          question: _(
            'Kan jeg bruke billetten på både reisekort og mobil samtidig?',
            'Can I use the ticket on both travel card and mobile phone at the same time?',
            'Kan eg bruke billetten på både reisekort og mobil samtidig?',
          ),
          answer: _(
            'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
            'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
            'Nei, du kan berre bruke ein om gongen, og billetten kan ikkje delast med andre reisande.',
          ),
        },
        {
          question: _(
            'Kan jeg reise uten reisekort eller mobil?',
            'Can I travel without my travel card or phone?',
            'Kan eg reise utan reisekort eller mobil?',
          ),
          answer: _(
            'Du må alltid ha med deg det reisekortet eller mobilen du har valgt å bruke billetten på.',
            'You must always travel with the travel card or mobile phone you have chosen to use the ticket on.',
            'Du må alltid ha med deg det reisekortet eller mobilen du har valt å bruke billetten på.',
          ),
        },
        {
          question: _(
            `Jeg får ikke logget inn i Reis-appen med e-post`,
            `I can not log into the Reis app with e-mail`,
            `Eg får ikkje logga inn i Reis-appen med e-post`,
          ),
          answer: _(
            `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke reisekort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye brukerprofil. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny brukerprofil i appen.`,
            `It is not possible to log into the app with e-mail as of today. You can continue to use your travel card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user profile. You can contact customer service regarding a refund if you still want to create a new user profile in the app.`,
            `Det er ikkje mogleg å logga inn i appen med e-post per i dag. Du kan fortsette å bruke reisekort eller opprette ein ny brukarprofil med mobilnummer som innlogging. Merk at billettane ikkje vil bli overførte til den nye brukarprofilen. Du kan kontakte kundesenteret vedrørande refusjon dersom du likevel vil lage ein ny brukarprofil i appen.`,
          ),
        },
        {
          question: _(
            `Har du flere spørsmål om billettkjøp?`,
            `Do you have any other questions about ticket purchases?`,
            `Har du fleire spørsmål om billettkjøp?`,
          ),
          answer: _(
            `Se flere måter å kontakte oss på reisnordland.no/kontakt-oss`,
            `See how to contact us at reisnordland.com/contact-us`,
            `Sjå fleire måtar å kontakte oss på reisnordland.no/kontakt-oss`,
          ),
        },
      ],
    },
    toggleToken: {
      title: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
        'Byt mellom reisekort / mobil',
      ),
      radioBox: {
        tCard: {
          title: _('Reisekort', 'Travel card', 'Reisekort'),
          description: _(
            'Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
            'Les av reisekortet ditt på holdeplass eller om bord. Kortet lesast av ved kontroll.',
          ),
          a11yLabel: _(
            'reisekort. Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'travel card. Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
            'reisekort. Les av reisekortet ditt på holdeplass eller om bord. Kortet lesast av ved kontroll.',
          ),
          a11yHint: _(
            'Aktivér for å velge reisekort.',
            'Activate to select travel card',
            'Aktivér for å velje reisekort.',
          ),
        },
      },
      noTravelCard: _(
        'Du har ikke et reisekort registrert. Hvis du ønsker å bruke reisekort kan du legge til dette på din profil i [nettbutikken](https://nettbutikk.reisnordland.no/).',
        'You have no travel card registered, if you wish to use travel card as travel token you may add this to your profile in the [webshop](https://nettbutikk.reisnordland.no/).',
        'Du har ikkje registrert eit reisekort. Hvis du ynskjer å bruke reisekort kan du legge til dette på profilen din i [nettbutikken](https://nettbutikk.reisnordland.no/).',
      ),
    },
  },
  fram: {
    travelToken: {
      header: {
        title: _(
          'Bruk billett på reisekort / mobil',
          'Use ticket on travel card / phone',
          'Bruk billett på reisekort / mobil',
        ),
      },
      changeTokenButton: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
        'Byt mellom reisekort / mobil',
      ),
      faqs: [
        {
          question: _(
            'Hva skjer om jeg mister reisekortet eller mobilen?',
            'What happens if I lose my travel card or phone?',
            'Kva skjer om eg mistar reisekortet eller mobilen?',
          ),
          answer: _(
            'Billetten din ligger trygt lagret i Min bruker. Velg å bruke billetten på en annen mobil eller reisekort.',
            'Your ticket is safely stored in My user. Switch to use the ticket on another mobile phone or travel card.',
            'Billetten din ligg trygt lagra i Min brukar. Vel å bruke billetten på ein annan mobil eller eit anna reisekort.',
          ),
        },
        {
          question: _(
            'Kan jeg bruke billetten på både reisekort og mobil samtidig?',
            'Can I use the ticket on both travel card and mobile phone at the same time?',
            'Kan eg bruke billetten på både reisekort og mobil samtidig?',
          ),
          answer: _(
            'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
            'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
            'Nei, du kan berre bruke ein om gongen, og billetten kan ikkje delast med andre reisande.',
          ),
        },
        {
          question: _(
            'Kan jeg reise uten reisekort eller mobil?',
            'Can I travel without my travel card or phone?',
            'Kan eg reise utan reisekort eller mobil?',
          ),
          answer: _(
            'Du må alltid ha med deg det reisekortet eller mobilen du har valgt å bruke billetten på.',
            'You must always travel with the travel card or mobile phone you have chosen to use the ticket on.',
            'Du må alltid ha med deg det reisekortet eller mobilen du har valt å bruke billetten på.',
          ),
        },
        {
          question: _(
            `Jeg får ikke logget inn i FRAM-appen med e-post`,
            `I can not log into the FRAM app with e-mail`,
            `Eg får ikkje logga inn i FRAM-appen med e-post`,
          ),
          answer: _(
            `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan fortsette å bruke reisekort eller opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye bruker. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny bruker i appen.`,
            `It is not possible to log into the app with e-mail as of today. You can continue to use your travel card or create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user. You can contact customer service regarding a refund if you still want to create a new user in the app.`,
            `Det er ikkje mogleg å logga inn i appen med e-post per i dag. Du kan fortsette å bruke reisekort eller opprette ein ny brukarprofil med mobilnummer som innlogging. Merk at billettane ikkje vil bli overført til den nye brukaren. Du kan kontakte kundesenteret vedrørande refusjon dersom du likevel vil laga ein ny brukar i appen.`,
          ),
        },
        {
          question: _(
            `Har du flere spørsmål om billettkjøp?`,
            `Do you have any other questions about ticket purchases?`,
            `Har du fleire spørsmål om billettkjøp?`,
          ),
          answer: _(
            `Se flere måter å kontakte oss på frammr.no/kontakt-oss`,
            `See how to contact us at en.frammr.no/contact-us`,
            `Sjå fleire måtar å kontakte oss på frammr.no/kontakt-oss`,
          ),
        },
      ],
      faqsWithoutTravelcard: [
        {
          question: _(
            'Hva skjer om jeg mister mobilen?',
            'What happens if I lose my phone?',
            'Kva skjer om eg mistar mobilen?',
          ),
          answer: _(
            'Billetten din ligger trygt lagret i Min profil. Velg å bruke billetten på en annen mobil.',
            'Your ticket is safely stored in My profile. Switch to use the ticket on another mobile phone.',
            'Billetten din blir trygt lagra i Min profil. Vel å bruke billetten på ein annan mobil.',
          ),
        },
        {
          question: _(
            'Kan jeg bruke billetten på flere mobiler samtidig?',
            'Can I use the ticket on several mobile phones at the same time?',
            'Kan eg bruke billetten på fleire mobilar samtidig?',
          ),
          answer: _(
            'Nei, du kan kun bruke en av gangen, og billetten kan ikke deles med andre reisende.',
            'No, you can only use one at a time and the ticket cannot be shared with other travellers.',
            'Nei, du kan berre bruke den på éin mobil av gongen, og billetten kan ikkje delast med andre reisande.',
          ),
        },
        {
          question: _(
            'Kan jeg reise uten mobil?',
            'Can I travel without my phone?',
            'Kan eg reise utan mobil?',
          ),
          answer: _(
            'Du må alltid ha med deg det mobilen du har valgt å bruke billetten på.',
            'You must always travel with the mobile phone you have chosen to use the ticket on.',
            'Du må alltid ha med deg mobilen du har valgt å bruke billetten på.',
          ),
        },
        {
          question: _(
            `Jeg får ikke logget inn i FRAM-appen med e-post`,
            `I can not log into the FRAM app with e-mail`,
            `Eg får ikkje logga inn i FRAM-appen med e-post`,
          ),
          answer: _(
            `Det er ikke mulig å logge inn i appen med e-post per i dag. Du kan opprette en ny brukerprofil med mobilnummer som innlogging. Merk at billettene ikke vil bli overført til din nye bruker. Du kan kontakte kundesenteret vedrørende refusjon dersom du likevel vil lage en ny bruker i appen.`,
            `It is not possible to log into the app with e-mail as of today. You can create a new user profile with a mobile number as login. Note that the tickets will not be transferred to your new user. You can contact customer service regarding a refund if you still want to create a new user in the app.`,
            `Det er ikkje mogleg å logga inn i appen med e-post per i dag. Du kan opprette ein ny brukarprofil med mobilnummer som innlogging. Merk at billettane ikkje vil verte overførte til den nye brukaren. Du kan kontakte kundesenteret vedrørande refusjon dersom du likevel vil opprette ein ny brukar i appen.`,
          ),
        },
        {
          question: _(
            `Har du flere spørsmål om billettkjøp?`,
            `Do you have any other questions about ticket purchases?`,
            `Har du fleire spørsmål om billettkjøp?`,
          ),
          answer: _(
            `Se flere måter å kontakte oss på frammr.no/kontakt-oss`,
            `See how to contact us at en.frammr.no/contact-us`,
            `Sjå fleire måtar å kontakte oss på frammr.no/kontakt-oss`,
          ),
        },
      ],
    },
    toggleToken: {
      title: _(
        'Bytt mellom reisekort / mobil',
        'Switch between travel card / phone',
        'Byt mellom reisekort / mobil',
      ),
      radioBox: {
        tCard: {
          title: _('Reisekort', 'Travel card', 'Reisekort'),
          description: _(
            'Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
            'Les av reisekortet ditt på holdeplass eller om bord. Kortet vil lesast av ved kontroll.',
          ),
          a11yLabel: _(
            'reisekort. Les av reisekortet ditt på holdeplass eller om bord. Kortet leses av ved kontroll.',
            'travel card. Validate your travel card at the bus stop or on board. The card will be scanned in a ticket inspection.',
            'reisekort. Les av reisekortet ditt på holdeplass eller om bord. Kortet vil lesast av ved kontroll.',
          ),
          a11yHint: _(
            'Aktivér for å velge reisekort.',
            'Activate to select travel card',
            'Aktivér for å velge reisekort.',
          ),
        },
      },
      noTravelCard: _(
        'Du har ikke et reisekort registrert. Hvis du ønsker å bruke reisekort kan du legge til dette på din bruker i [nettbutikken](https://nettbutikk.frammr.no).',
        'You have no travel card registered, if you wish to use travel card as travel token you may add this to your profile in the [online store](https://nettbutikk.frammr.no).',
        'Du har ingen registrerte reisekort. Om du ønsker å bruke reisekort kan du legge det til på profilen din i [nettbutikken](https://nettbutikk.frammr.no).',
      ),
    },
  },
});
