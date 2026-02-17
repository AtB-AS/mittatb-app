import {translation as _, Language} from '../../commons';
import {Platform} from 'react-native';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {
  GeofencingZoneExplanationsType,
  ParkingVehicleTypes,
} from '@atb/modules/map';
import {formatNumberToString} from '@atb-as/utils';

export const MobilityTexts = {
  formFactor: (formFactor: FormFactor, isPlural: boolean = false) => {
    switch (formFactor) {
      case FormFactor.Scooter:
        return isPlural
          ? _('Elsparkesykler', 'E-scooters', 'Elsparkesyklar')
          : _('Elsparkesykkel', 'E-scooter', 'Elsparkesykkel');
      case FormFactor.Bicycle:
        return isPlural
          ? _('Bysykler', 'City Bikes', 'Bysyklar')
          : _('Bysykkel', 'City Bike', 'Bysykkel');
      case FormFactor.Car:
        return isPlural
          ? _('Delebiler', 'Shared Cars', 'Delebilar')
          : _('Delebil', 'Car sharing', 'Delebil');
      default:
        return _('Annet', 'Other', 'Anna');
    }
  },
  finishing: {
    button: _('Ta bilde', 'Take a photo', 'Ta eit bilde'),
    header: _(
      'Ta bilde før du avslutter',
      'Take a photo before you finish',
      'Ta eit bilde før du avsluttar',
    ),
    p1: _(
      'Du kan få bot hvis sparkesykkelen meldes som feilparkert.',
      'You may get a fine if the scooter is reported as incorrectly parked.',
      'Du kan få bot viss sparkesykkelen vert meldt som feilparkert.',
    ),
    p2: _(
      'Bilde kan brukes som bevis på at du har parkert riktig.',
      'Photo can be used as evidence that you have parked correctly.',
      'Bilde kan brukast som bevis på at du har parkert riktig.',
    ),
  },
  photo: {
    header: _(
      'Ta bilde av elsparkesykkelen',
      'Take a photo of the e-scooter',
      'Ta bilete av elsparkesykkelen',
    ),
    subHeader: _(
      'Du blir ikke belastet for tiden du bruker på å ta bilde.',
      'You will not be charged for the time you spend taking the photo.',
      'Du blir ikkje belastet for tida du bruker på å ta bilete.',
    ),
  },
  shmoRequirements: {
    loginBlocker: _('Logg inn', 'Log in', 'Logg inn'),
    loginBlockerInfoMessage: _(
      'Du må logge inn og gå igjennom noen steg for å starte turen',
      'You need to log in and go through some steps to start the trip',
      'Du må logge inn og gå igjennom nokre steg for å starte turen',
    ),
    underAgeWarning: (legalAge: number) =>
      _(
        `Du må være ${legalAge} år eller eldre for å bruke denne el-sparkesykkelen`,
        `You must be ${legalAge} years or older to use this e-scooter`,
        `Du må vere ${legalAge} år eller eldre for å bruke denne el-sparkesykkelen`,
      ),
    shmoBlockers: _('Fullfør steg', 'Complete steps', 'Fullfør steg'),
    shmoBlockersInfoMessage: (numberOfBlockers: number) =>
      _(
        `Du må igjennom ${numberOfBlockers} steg før du kan starte turen`,
        `You need to go through ${numberOfBlockers} steps before you can start the trip`,
        `Du må gå igjennom ${numberOfBlockers} steg før du kan starte turen`,
      ),
    location: {
      title: _(
        'Vi trenger din posisjon',
        'We need your location',
        'Vi treng posisjonen din',
      ),
      description: _(
        'Du må gi tilgang til posisjonen din for å bruke en el-sparkesykkel',
        'You need to give access to your location to use an electric scooter',
        'Du må gi tilgang til posisjonen din for å bruke ein el-sparkesykkel',
      ),
      button: _('Del posisjon', 'Share location', 'Del posisjon'),
    },
    ageVerification: {
      title: _(
        'Vi må sjekke alderen din',
        'We need to verify your age',
        'Vi må sjekke alderen din',
      ),
      description: _(
        'El-sparkesykler har en aldersgrense. Bekreft alderen din med Vipps.',
        'E-scooters have an age limit. Verify your age with Vipps.',
        'El-sparkesyklar har ein aldersgrense. Verifiser alderen din med Vipps.',
      ),
      button: _(
        'Fortsett med Vipps',
        'Continue with Vipps',
        'Fortsett med Vipps',
      ),
    },
    payment: {
      title: _(
        'Vi trenger et betalingskort',
        'We need a payment card',
        'Vi treng eit betalingskort',
      ),
      description: _(
        'Du må legge til et betalingskort for å bruke en el-sparkesykkel',
        'You need to add a payment card to use an electric scooter',
        'Du må legge til et betalingskort for å bruke ein el-sparkesykkel',
      ),
      button: _(
        'Legg til betalingskort',
        'Add payment card',
        'Legg til betalingskort',
      ),
    },
    terms: {
      title: _('Bruksvilkår', 'Terms of use', 'Bruksvilkår'),
      buttonOne: _(
        'Godta bruksvilkår',
        'Accept terms of use',
        'Godta bruksvilkår',
      ),
      buttonTwo: _('Bruksvilkår', 'Terms of use', 'Bruksvilkår'),
    },
  },
  helpText: _('Trenger du hjelp?', 'Need help?', 'Treng du hjelp?'),
  unknownOperator: _('Ukjent operatør', 'Unknown operator', 'Ukjent operatør'),
  operatorAppSwitchButton: (operator: string) =>
    _(`Åpne ${operator}`, `Open ${operator}`, `Åpne ${operator}`),
  appMissingAlert: {
    title: (operator: string) =>
      _(`Last ned ${operator}`, `Download ${operator}`, `Last ned ${operator}`),
    text: (operator: string) =>
      _(
        `Det ser ut som du mangler ${operator}-appen`,
        `It seems you don't have the ${operator} app installed`,
        `Det ser ut som du manglar ${operator}-appen`,
      ),
    buttons: {
      cancel: _('Avbryt', 'Cancel', 'Avbryt'),
      openAppStore: (appStore: string) =>
        _(`Åpne ${appStore}`, `Open ${appStore}`, `Åpne ${appStore}`),
    },
  },
  appStore: () =>
    Platform.OS === 'ios'
      ? _('App Store', 'App Store', 'App Store')
      : _('Play Butikk', 'Play Store', 'Play Butikk'),
  appStoreOpenError: {
    text: (appStore: string, operator: string) =>
      _(
        `Vi fikk dessverre ikke til å åpne ${appStore} automatisk. Gå til ${appStore} og søk etter ${operator}-appen`,
        `We could not open ${appStore}. Please go to ${appStore} and search for ${operator}`,
        `Vi fikk dessverre ikkje opna ${appStore} automatisk. Gå til ${appStore} og søk etter ${operator}-appen`,
      ),
    button: _('OK', 'OK', 'OK'),
  },
  onboarding: {
    title: _(
      'Elsparkesykler og bysykler i kartet 🎉',
      'Electrical scooters and city bikes in map 🎉',
      'Elsparkesyklar og bysyklar i kartet 🎉',
    ),
    body: _(
      'Se elsparkesykler og bysykler i Trondheim på ett sted. Skru på tjenesten i kartet.',
      'See electric scooters and city bikes in Trondheim in one app. Enable this feature through the map.',
      'Sjå elsparkesyklar og bysyklar i Trondheim på ett sted. Skru på tenesta i kartet.',
    ),
    button: _('Den er grei!', 'Sounds good!', 'Høres bra ut!'),
    a11yLabel: _(
      'Se elsparkesykler og bysykler i Trondheim på ett sted. Skru på tjenesten i kartet.',
      'See electric scooters and city bikes in Trondheim in one app. Enable this feature through the map.',
      'Sjå elsparkesyklar og bysyklar i Trondheim på ett sted. Skru på tenesta i kartet.',
    ),
  },
  filter: {
    selectAll: _('Alle', 'All', 'Alle'),
    sectionTitle: {
      sharedMobility: _(
        'Delingsmobilitet',
        'Shared Mobility',
        'Delingsmobilitet',
      ),
    },
  },
  reportParkingViolation: _(
    'Rapporter som feilparkert',
    'Report as wrongly parked',
    'Rapporter som feilparkert',
  ),
  range: (range: string) =>
    _(
      `omtrent ${range} rekkevidde`,
      `approximately ${range} range`,
      `omlag ${range} rekkjevidde`,
    ),
  includedWithTheTicket: _(
    'Inkludert i billetten',
    'Included with the ticket',
    'Inkludert i billetten',
  ),
  showInMap: _('Se i kart', 'Show in map', 'Sjå i kart'),
  showInMapA11yLabel: _(
    'Aktiver for å se i kart',
    'Activate to show in map',
    'Aktiver for å sjå i kart',
  ),
  errorLoadingValueCode: {
    message: _(
      'Henting av verdikode feilet',
      'Fetching value code failed',
      'Henting av verdikode feila',
    ),
    retry: _('Prøv på nytt', 'Try again', `Prøv på nytt`),
  },
  totalCost: _('Totalkostnad', 'Total cost', 'Totalkostnad'),
  time: _('Tid', 'Time', 'Tid'),
  trip: {
    button: {
      start: _('Start tur', 'Start trip', 'Start tur'),
      startLoading: _('Starter tur', 'Starting trip', 'Startar tur'),
      end: _('Avslutt tur', 'End trip', 'Avslutt tur'),
      endLoading: _('Avslutter tur', 'Ending trip', 'Avsluttar tur'),
      finishTrip: _('Lukk', 'Close', 'Lukk'),
    },
    endAlert: {
      header: _(
        'Vil du avslutte turen?',
        'Do you want to end the trip?',
        'Vil du avslutte turen?',
      ),
      continue: _('Fortsett turen', 'Continue the trip', 'Hald fram turen'),
      end: _('Avslutt turen', 'End the trip', 'Avslutt turen'),
    },
  },
  fareContractHeader: (formFactor: FormFactor, operatorName: string) => {
    switch (formFactor) {
      case FormFactor.Scooter:
      case FormFactor.ScooterStanding:
        return _(
          `Elsparkesykkel fra ${operatorName}`,
          `E-scooter from ${operatorName}`,
          `Elsparkesykkel frå ${operatorName}`,
        );
      case FormFactor.ScooterSeated:
        return _(
          `Scooter fra ${operatorName}`,
          `Scooter from ${operatorName}`,
          `Scooter frå ${operatorName}`,
        );
      case FormFactor.Bicycle:
        return _(
          `Sykkel fra ${operatorName}`,
          `Bicycle from ${operatorName}`,
          `Sykkel frå ${operatorName}`,
        );
      case FormFactor.Car:
        return _(
          `Bil fra ${operatorName}`,
          `Car from ${operatorName}`,
          `Bil frå ${operatorName}`,
        );
      case FormFactor.CargoBicycle:
        return _(
          `Lastesykkel fra ${operatorName}`,
          `Cargo bike from ${operatorName}`,
          `Lastesykkel frå ${operatorName}`,
        );
      case FormFactor.Moped:
        return _(
          `Moped fra ${operatorName}`,
          `Moped from ${operatorName}`,
          `Moped frå ${operatorName}`,
        );
      case FormFactor.Other:
        return _(
          `Annet kjøretøy fra ${operatorName}`,
          `Other vehicle from ${operatorName}`,
          `Anna køyretøy frå ${operatorName}`,
        );
    }
  },
};

export const ScooterTexts = {
  seeAppForPrices: (operator: string) =>
    _(
      `Se ${operator}-appen for priser`,
      `See ${operator} app for prices`,
      `Sjå ${operator}-appen for prisar`,
    ),
  pricingPlan: {
    price: (price: number, language: Language) =>
      price > 0
        ? _(
            `+ ${formatNumberToString(price, language)} kr for oppstart`,
            `+ ${formatNumberToString(price, language)} kr to unlock`,
            `+ ${formatNumberToString(price, language)} kr for å låse opp`,
          )
        : _('Gratis oppstart', 'Free to unlock', 'Gratis oppstart'),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne sparkesykkelen',
    "Ops! We couldn't find this scooter",
    'Ops! Vi fann ikkje denne sparkesykkelen',
  ),
  range: _('rekkevidde', 'range', 'rekkjevidde'),
  unlock: _('opplåsning', 'unlock', 'opplåsing'),
  free: _('Gratis', 'Free', 'Gratis'),
  per: {
    unit(unit: string) {
      switch (unit) {
        case 'min':
          return _('per minutt', 'per minute', 'per minutt');
        case 'km':
          return _('per kilometer', 'per kilometer', 'per kilometer');
        default:
          return _('per', 'per', 'per');
      }
    },
    discount(unit: string, price: string) {
      switch (unit) {
        case 'min':
          return _(
            `så ${price}kr/min`,
            `then ${price}kr/min`,
            `så ${price}kr/min`,
          );
        case 'km':
          return _(
            `så ${price}kr/km`,
            `then ${price}kr/km`,
            `så ${price}kr/km`,
          );
        default:
          return _(`så ${price}kr`, `then ${price}kr`, `så ${price}kr`);
      }
    },
  },
};

export const BicycleTexts = {
  stations: {
    numBikesAvailable: (amount: number) =>
      amount === 1
        ? _('ledig sykkel', 'available bike', 'ledig sykkel')
        : _('ledige sykler', 'available bikes', 'ledige syklar'),
    numDocksAvailable: (amount: number | undefined) => {
      if (amount === undefined) return _('', '', '');
      return amount === 1
        ? _('ledig sykkelplass', 'available dock', 'ledig sykkelplass')
        : _('ledige sykkelplasser', 'available docks', 'ledige sykkelplassar');
    },
    unknownDocksAvailable: _('Ukjent antall', 'Unknown', 'Ukjent antal'),
  },
  humanPoweredBike: _('Sykkel', 'Bicycle', 'Sykkel'),
  loadingFailed: _(
    'Ops! Vi fant ikke denne sykkelstasjonen',
    "Ops! We couldn't find this bike station",
    'Ops! Vi fann ikkje denne sykkelstasjonen',
  ),
};

export const CarSharingTexts = {
  stations: {
    carsAvailable: (amount: number, capacity: number) =>
      _(
        `${amount} av ${capacity}`,
        `${amount} of ${capacity}`,
        `${amount} av ${capacity}`,
      ),
    carsAvailableLabel: _('biler ledig', 'cars available', 'bilar ledige'),
    noCarsAvailable: _(
      'Ingen ledige biler',
      'No available cars',
      'Ingen ledige bilar',
    ),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne parkeringen',
    "Ops! We couldn't find this car sharing station",
    'Ops! Vi fann ikkje denne parkeringa',
  ),
  propultionType: (type: PropulsionType) => {
    switch (type) {
      case PropulsionType.Electric:
        return _('Elektrisk', 'Electric', 'Elektrisk');
      case PropulsionType.CombustionDiesel:
        return _('Diesel', 'Diesel', 'Diesel');
      case PropulsionType.Combustion:
        return _('Bensin', 'Petrol', 'Bensin');
      case PropulsionType.PlugInHybrid:
        return _('Plug-in hybrid', 'Plug-in hybrid', 'Plug-in hybrid');
      case PropulsionType.HydrogenFuelCell:
        return _('Hydrogen', 'Hydrogen', 'Hydrogen');
      case PropulsionType.Hybrid:
        return _('Hybrid', 'Hybrid', 'Hybrid');
      default:
        return _(
          'Ukjent drivstofftype',
          'Unknown propultion type',
          'Ukjent drivstofftype',
        );
    }
  },
};

export const ParkAndRideTexts = {
  title: _('Innfartsparkering', "Park'n Ride", 'Innfartsparkering'),
  parkingFor: (type: ParkingVehicleTypes) => {
    switch (type) {
      case 'pedalCycle':
        return _(
          '**Sykkelparkering**',
          '**Bike parking**',
          '**Sykkelparkering**',
        );
      case 'car':
      default:
        return _('**Bilparkering**', '**Car parking**', '**Bilparkering**');
    }
  },
  disclaimer: _(
    'Betaling eller andre vilkår kan gjelde på denne innfartsparkeringen',
    'Payment or other terms and conditions may apply to this parking',
    'Betaling eller andre vilkår kan gjelde på denne innfartsparkeringa',
  ),
  capacity: (capacity: number) =>
    _(
      `**${capacity}** plasser totalt`,
      `**${capacity}** parking spaces`,
      `**${capacity}** plassar totalt`,
    ),
  unknownCapacity: _(
    'Ukjent antall plasser',
    'Unknown number of spaces',
    'Ukjend antal plassar',
  ),
};

export const GeofencingZoneExplanations: GeofencingZoneExplanationsType = {
  allowed: {
    title: _('Tillatt sone', 'Allowed Area', 'Tillatt sone'),
    description: _(
      'Her kan du kjøre el-sparkesykkelen',
      'You can ride the e-scooter here',
      'Her kan du køyre el-sparkesykkelen',
    ),
  },
  slow: {
    title: _('Saktesone', 'Slow Zone', 'Saktesone'),
    description: _(
      'Farten blir redusert her',
      'The speed will be reduced here',
      'Farta blir redusert her',
    ),
  },

  /*** future features, pending support from Entur's Mobility API: ***/
  // https://github.com/entur/lamassu/issues/448
  // Parking: {
  //   title: _('Parkeringssone', 'Parking Zone', 'Parkeringssone'),
  //   description: _(
  //     'Dette er et passende sted å parkere',
  //     'This is a suitable place to park',
  //     'Dette er ein passande stad å parkere',
  //   ),
  // },
  // BonusParking: {
  //   title: _(
  //     'Bonusparkeringssone',
  //     'Bonus Parking Zone',
  //     'Bonusparkeringssone',
  //   ),
  //   description: _(
  //     'Her får du rabatt for å parkere',
  //     'By parking here you get a discount',
  //     'Her får du rabatt for å parkere',
  //   ),
  // },

  noParking: {
    title: _('Parkering forbudt', 'No Parking', 'Parkering forboden'),
    description: _(
      'Du kan ikke parkere her',
      'You cannot park here',
      'Du kan ikkje parkere her',
    ),
  },
  noEntry: {
    title: _('Kjøring forbudt', 'No Riding', 'Køyring forboden'),
    description: _(
      'Du kan ikke kjøre eller parkere her',
      'You cannot ride or park here',
      'Du kan ikkje køyre eller parkere her',
    ),
  },
  unspecified: {
    title: _('Uspesifisert', 'Unspecified', 'Uspesifisert'),
    description: _(
      'Ingen regler angitt for dette området',
      'No rules defined for this area',
      'Ingen reglar angitt for dette området',
    ),
  },
};

export const GeofencingZoneExtraExplanations = {
  isStationParking: _(
    'Se etter parkeringssoner i kartet.',
    'Look for parking zones on the map.',
    'Sjå etter parkeringssoner i kartet.',
  ),
};

export const ShmoWarnings = {
  scooterDisabled: _(
    'Denne el-sparkesykkelen er ikke tilgjengelig akkurat nå ',
    'This e-scooter is not available right now',
    'Denne el-sparkesykkelen er ikkje tilgjengeleg akkurat no',
  ),
  scooterClosed: (start: string | undefined, end: string | undefined) =>
    start && end
      ? _(
          `Elsparkesykkelen er kun tilgjengelig mellom ${start} og ${end}`,
          `The E-scooter is only available between ${start} and ${end}`,
          `Elsparkesykkelen er berre tilgjengeleg mellom ${start} og ${end}`,
        )
      : _(
          'Elsparkesykkelen er utenfor åpningstiden',
          'The E-scooter is outside opening hours',
          'Elsparkesykkelen er utanfor opningstiden',
        ),
  scooterNotNear: _(
    'Du må være i nærheten av elsparkesykkelen for å starte en tur',
    'You need to be near the e-scooter to start a ride.',
    'Du må vere i nærleiken av elsparkesykkelen for å starte ein tur',
  ),
  positionUnavailable: _(
    'Posisjon utilgjengelig. Det kan oppstå problemer med å avslutte turen.',
    'Position unavailable. There may be issues ending the trip.',
    'Posisjon utilgjengeleg. Det kan oppstå problem med å avslutte turen.',
  ),
  somethingWentWrong: _(
    'Noe gikk galt. Prøv igjen eller kontakt operatøren.',
    'Something went wrong. Try again or contact the operator.',
    'Noko gjekk gale. Prøv igjen eller kontakt operatøren.',
  ),
  noInternetConnection: _(
    'Du har ingen internettforbindelse',
    'You have no internet connection',
    'Du har ingen internettilkopling',
  ),
};
