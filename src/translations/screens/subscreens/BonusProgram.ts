import {spellOut} from '@atb/utils/accessibility';
import {translation as _} from '../../commons';

const BonusProgramTexts = {
  points: _('poeng', 'points', 'poeng'),
  costA11yLabel: (amount: number) =>
    _(`Bruk ${amount} poeng`, `Bruk ${amount} points`, `Bruk ${amount} poeng`),
  spend: _('Bruk', 'Use', 'Bruk'),
  amountPoints: (amount: number) =>
    _(`${amount} poeng`, `${amount} points`, `${amount} poeng`),

  youHave: _('Du har', 'You have', 'Du har'),

  yourBonusBalanceA11yLabel: (bonusBalance: number | null) => {
    return _(
      `Du har ${bonusBalance == null ? 'ukjent antall' : bonusBalance} poeng`,
      `You have ${bonusBalance == null ? 'unknown number of' : bonusBalance} points`,
      `Du har ${bonusBalance == null ? 'ukjent mengde' : bonusBalance} poeng`,
    );
  },

  fareContract: {
    youEarned: (bonusPointsEarned: number) =>
      _(
        `Du tjente **${bonusPointsEarned} poeng**!`,
        `You earned **${bonusPointsEarned} point${bonusPointsEarned === 1 ? '' : 's'}**!`,
        `Du tente **${bonusPointsEarned} poeng**!`,
      ),

    youEarnedA11yLabel: (bonusPointsEarned: number) =>
      _(
        `Du tjente ${bonusPointsEarned} poeng!`,
        `You earned ${bonusPointsEarned} point${bonusPointsEarned === 1 ? '' : 's'}!`,
        `Du tente ${bonusPointsEarned} poeng!`,
      ),
  },

  getCampaignPriceAt: (operatorName: string) =>
    _(
      `Få kampanjepris hos ${operatorName}`,
      `Get campaign price at ${operatorName}`,
      `Få kampanjepris hos ${operatorName}`,
    ),

  notEnoughPoints: _(
    'Du har ikke nok poeng',
    "You don't have enough points",
    'Du har ikkje nok poeng',
  ),

  log_in_operator_app_warning: (operatorName: string) =>
    _(
      `Du må være logget inn i ${operatorName}-appen for å få kampanjeprisen.`,
      `You must be logged in to the ${operatorName} app to get the campaign price.`,
      `Du må vera logga inn i ${operatorName}-appen for å få kampanjeprisen.`,
    ),

  bonusProfile: {
    header: {
      title: _('AtB Bonus', 'AtB Bonus', 'AtB Bonus'),
    },

    joinProgram: {
      title: _(
        'Reis billigere med AtB Bonus!',
        'Travel cheaper with AtB Bonus!',
        'Reis billegare med AtB Bonus!',
      ),
      description: _(
        'Bli med og tjen poeng hver gang du kjøper en enkeltbillett (voksen/student, sone A). Bruk poengene dine og få kampanjepris på ulike transportmidler i AtB-appen.',
        'Join and earn points every time you buy a single ticket (adult/student, zone A). Use your points and get campaign prices on various means of transport in the AtB app.',
        'Bli med og ten poeng kvar gong du kjøper ein enkeltbillett (vaksen/student, sone A). Bruk poenga dine og få kampanjepris på ulike transportmiddel i AtB-appen.',
      ),
      footer: _(
        'Dette er et prøveprosjekt som varer til slutten av året.',
        'This is a pilot project that will last until the end of the year.',
        'Dette er eit prøveprosjekt som varer til slutten av året.',
      ),
      button: {
        text: _('Bli med', 'Join', 'Bli med'),
      },
    },

    yourPoints: _('Dine poeng', 'Your points', 'poenga dine'),

    mapButton: {
      a11yLabel: _('Vis i kart', 'Show in map', 'Vis i kart'),
      a11yHint: _(
        'Kartet er ikke tilgjengelig med skjermleser.',
        'The map is not accessible with screen reader.',
        'Kartet er ikkje tilgjengeleg med skjermlesar.',
      ),
    },
    spendPoints: {
      heading: _(
        'Dette får du for poeng',
        'This is what you get for points',
        'Dette får du for poeng',
      ),
    },
    noData: _(
      'Klarte ikke å hente informasjon om AtB Bonus. Sjekk om du har internett og prøv på nytt.',
      "Couldn't load information about AtB Bonus. Check your internet connection and try again.",
      'Klarte ikkje å hente informasjon om AtB Bonus. Sjekk om du har internett og prøv på nytt.',
    ),

    noProfile: _(
      'Du må logge inn før du kan bli med i AtB Bonus',
      'You need to log in before you can join AtB Bonus',
      'Du må logga inn før du kan bli med i AtB Bonus',
    ),
    noBonusBalance: _(
      'Klarte ikke å vise poengene dine akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      "Couldn't display your points right now. You will still earn points as usual.",
      'Klarte ikkje å visa poenga dine akkurat no. Du vil framleis tena poeng som vanleg.',
    ),
    noBonusProducts: _(
      'Klarte ikke å vise dette akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      "Couldn't display this right now. You will still earn points as usual.",
      'Klarte ikkje å visa dette akkurat no. Du vil framleis tene poeng som vanleg.',
    ),
    readMore: {
      heading: _('Slik funker det', 'How it works', 'Slik funkar det'),
      download: {
        title: _('Last ned appene', 'Download the apps', 'Last ned appane'),
        description: _(
          'Du må laste ned og logge inn i appene til Trondheim Bysykkel og Hyre før du bruker poeng på deres tjenester.',
          'You need to download and log in to the apps for Trondheim City Bike and Hyre before using points on their services.',
          'Du må lasta ned og logga inn i appane til Trondheim Bysykkel og Hyre før du brukar poeng på tenestene deira.',
        ),
      },
      earnPoints: {
        title: _('Tjen poeng', 'Earn points', 'Tjen poeng'),
        description: (pointsPerProduct: string) =>
          pointsPerProduct
            ? _(
                `Du tjener ${pointsPerProduct} (voksen/student, sone A).`,
                `You earn ${pointsPerProduct} (adult/student, zone A).`,
                `Du tjener ${pointsPerProduct} (vaksen/student, sone A).`,
              )
            : _(
                'Du tjener poeng hver gang du kjøper en enkeltbillett (voksen/student, sone A).',
                'You earn points every time you buy a single ticket (adult/student, zone A).',
                'Du tener poeng kvar gong du kjøper ein enkeltbillett (vaksen/student, sone A).',
              ),
      },
      spendPoints: {
        title: _('Bruk poeng', 'Spend points', 'Bruk poeng'),
        description: _(
          'Du kan bruke poeng på turer med ulike transportmidler. Se listen under.',
          'You may use points on trips with different transport modes. See the list below.',
          'Du kan bruka poeng på turar med ulike transportmiddel. Sjå lista under.',
        ),
      },
      downloadOperator: (operator: string) =>
        _(
          `Last ned ${operator}`,
          `Download ${operator}`,
          `Last ned ${operator}`,
        ),
    },
    feedback: {
      heading: _('Tilbakemelding', 'Feedback', 'Tilbakemelding'),
      button: _(
        'Har du noe på hjertet?',
        'Do you have something on your mind?',
        'Har du noko på hjartet?',
      ),
    },
    faq: {
      heading: _(
        'Spørsmål og svar',
        'Questions and answers',
        'Spørsmål og svar',
      ),
      faqs: [
        {
          question: _(
            'Hvordan får jeg kampanjepris på enkeltbilletter?',
            'How do I get a campaign price on single tickets?',
            'Korleis får eg kampanjepris på enkeltbillettar?',
          ),
          answer: () =>
            _(
              'Følg den vanlige kjøpsflyten for enkeltbillett. På billettsammendraget kan du huke av for å bruke poeng for å få kampanjepris før du gjennomfører betalingen.',
              'Follow the regular purchase flow for single tickets. On the ticket summary, you can tick the box to use points and get a campaign price before you complete the payment.',
              'Følg den vanlege kjøpsflyten for enkeltbillett. På billettsamandraget kan du hake av for å bruka poeng for å få kampanjepris før du gjennomfører betalinga.',
            ),
        },
        {
          question: _(
            'Hvordan får jeg kampanjepris på elektrisk sparkesykkel, bysykkel eller leiebil?',
            'How do I get a campaign price on e-scooters, city bikes or rental cars?',
            'Korleis får eg kampanjepris på elektrisk sparkesykkel, bysykkel eller leigebil?',
          ),
          answer: () =>
            _(
              'Finn en bysykkelstasjon, elsparkesykkel eller Hyre-bilstasjon i kartet. Velg transportmiddelet du ønsker å bruke, og huk av for å bruke poeng for å få kampanjepris før du starter turen. \nTurer med Ryde gjennomføres direkte i AtB-appen. For Trondheim Bysykkel og Hyre blir du sendt videre til deres apper. Husk å laste ned appene og logge inn på forhånd, slik at kampanjekoden legges til automatisk.',
              'Find a city bike station, e-scooter or Hyre car station in the map. Select the mode of transport you want to use, and tick the box to use points to get a campaign price before you start your trip. \nTrips with Ryde are completed directly in the AtB app. For Trondheim Bysykkel and Hyre, you will be redirected to their apps. Remember to download the apps and log in beforehand, so that the campaign code is added automatically.',
              'Finn ein bysykkelstasjon, elsparkesykkel eller Hyre-bilstasjon i kartet. Vel transportmiddelet du ønskjer å bruka, og hak av for å bruka poeng for å få kampanjepris før du startar turen. \nTurar med Ryde blir gjennomførte direkte i AtB-appen. For Trondheim Bysykkel og Hyre blir du send vidare til appane deira. Hugs å lasta ned appane og logga inn på førehand, slik at kampanjekoden blir lagd til automatisk.',
            ),
        },
        {
          question: _(
            'Hva gjør jeg dersom jeg ikke ser elektriske sparkesykler, bysykler eller leiebiler i kartet?',
            "What do I do if I can't see e-scooters, city bikes or rental cars in the map?",
            'Kva gjer eg dersom eg ikkje ser elektriske sparkesyklar, bysyklar eller leigebilar i kartet?',
          ),
          answer: () =>
            _(
              'Du kan velge hvilke transportmidler som skal vises i kartet ved å trykke på filterikonet. Der kan du slå av eller på visningen av elsparkesykler, bysykler og leiebiler.',
              'You can choose which modes of transport are shown in the map by tapping the filter icon. There you can turn the display of e-scooters, city bikes and rental cars on or off.',
              'Du kan velja kva transportmiddel som skal visast i kartet ved å trykkja på filterikonet. Der kan du slå av eller på visinga av elsparkesyklar, bysyklar og leigebilar.',
            ),
        },
        {
          question: _(
            'Hvordan vet jeg at jeg har nok poeng?',
            'How do I know if I have enough points?',
            'Korleis veit eg at eg har nok poeng?',
          ),
          answer: () =>
            _(
              'Du kan se hvor mange poeng du må bruke for å få de ulike kampanjeprisene i oversikten på denne siden eller i kjøpsflyten for de aktuelle transportmidlene. \nDin nåværende poengsaldo finner du på denne siden, øverst til høyre i kartet og på billettsiden.',
              'You can see how many points you need to use to get the different campaign prices in the overview on this page, or in the purchase flow for the relevant modes of transport. \nYou can find your current points balance on this page, in the top right corner of the map and on the tickets page.',
              'Du kan sjå kor mange poeng du må bruka for å få dei ulike kampanjeprisane i oversikta på denne sida eller i kjøpsflyten for dei aktuelle transportmidla. \nDin noverande poengsaldo finn du på denne sida, øvst til høgre i kartet og på billettsida.',
            ),
        },
        {
          question: _(
            'Hvor lenge varer prøveprosjektet?',
            'How long does the pilot project last?',
            'Kor lenge varer prøveprosjektet?',
          ),
          answer: () =>
            _(
              'Prøveprosjektet varer ut 2026.',
              'The pilot project lasts until the end of 2026.',
              'Prøveprosjektet varer ut 2026.',
            ),
        },
      ],
      pointsPerProductLabel: (value: number, productName: string) =>
        _(
          `${value} poeng hver gang du kjøper en ${productName}`,
          `${value} points every time you buy a ${productName}`,
          `${value} poeng kvar gong du kjøper ein ${productName}`,
        ),
    },
  },

  terms: {
    title: _('Dette godtar du', 'You agree to this', 'Dette godtar du'),
    term1: _(
      'Poeng brukes kun i AtB-appen.',
      'Points can only be used in the AtB app.',
      'Poeng kan kun brukast i AtB-appen.',
    ),
    term2: _(
      'Ubrukte poeng slettes når prøveperioden er over.',
      'Unused points will be deleted when the pilot period is over.',
      'Ubrukte poeng slettes når prøveperioden er over.',
    ),
    term3: _(
      'Vi kan kontakte deg for tilbakemeldinger i prøveperioden.',
      'We may contact you to ask for feedback during the pilot period.',
      'Vi kan kontakta deg for tilbakemeldingar i prøveperioden.',
    ),
    term4: _(
      'Data deles med Transportøkonomisk institutt.',
      'Data is shared with Institute of Transport Economics.',
      'Data blir delte med Transportøkonomisk institutt.',
    ),
    termsLink: _(
      'Vilkår for AtB sine prøveprosjekt',
      "Terms for AtB's pilot projects",
      'Vilkår for AtB sine prøveprosjekt',
    ),
    error: {
      title: _(
        'Klarte ikke å melde deg inn',
        "Couldn't enroll you",
        'Klarte ikkje å melde deg inn',
      ),
      description: _(
        'Du ble ikke innmeldt i AtB Bonus. Prøv igjen senere.',
        'You were not enrolled in AtB Bonus. Please try again later.',
        'Du ble ikkje innmeldt i AtB Bonus. Prøv igjen seinare.',
      ),
    },

    button: {
      text: _('Godta', 'Accept', 'Godta'),
      a11yLabel: _(
        'Godta vilkårene og bli med',
        'Accept the terms and join',
        'Godta vilkårene og bli med',
      ),
    },
  },

  myCouponCodes: {
    linkText: _('Mine kampanjekoder', 'My coupon codes', 'Mine kampanjekodar'),
    title: _('Mine kampanjekoder', 'My coupon codes', 'Mine kampanjekodar'),
    emptyTitle: _(
      'Ingen kampanjekoder',
      'No coupon codes',
      'Ingen kampanjekodar',
    ),
    emptyState: _(
      'Når du aktiverer en kampanjekode, vil den vises her.',
      'When you activate a coupon code, it will appear here.',
      'Når du aktiverer ein kampanjekode, vil den visast her.',
    ),
    howItWorksTitle: _(
      'Hvordan fungerer kampanjekoden?',
      'How does the coupon code work?',
      'Korleis fungerer kampanjekoden?',
    ),
    howItWorksBody: _(
      'Når du huker av for å bruke poeng, legges kampanjekoden automatisk til i Hyre- eller Bysykkelappen. Hvis dette ikke skjer, for eksempel fordi du ikke var logget inn, kan du legge den til manuelt i deres app.',
      "When you choose to use points, the coupon code is automatically added to the Hyre or City Bike app. If this doesn't happen, for example because you weren't logged in, you can add it manually in their app.",
      'Når du hukar av for å bruke poeng, blir kampanjekoden automatisk lagt til i Hyre- eller Bysykkelappen. Viss dette ikkje skjer, til dømes fordi du ikkje var logga inn, kan du leggje den til manuelt i appen deira.',
    ),
    copy: _('Kopier', 'Copy', 'Kopier'),
    copyA11yHint: _(
      'Klikk for å kopiere kampanjekoden',
      'Press to copy the coupon code',
      'Klikk for å kopiere kampanjekoden',
    ),
    codeA11yLabel: (code: string) =>
      _(
        `Kode ${spellOut(code)}`,
        `Code ${spellOut(code)}`,
        `Kode ${spellOut(code)}`,
      ),
    errorMessage: _(
      'Klarte ikke å hente kampanjekodene dine. Prøv igjen senere.',
      "Couldn't load your coupon codes. Please try again later.",
      'Klarte ikkje å hente kampanjekodane dine. Prøv igjen seinare.',
    ),
    retry: _('Prøv igjen', 'Try again', 'Prøv igjen'),
  },
};
export default BonusProgramTexts;
