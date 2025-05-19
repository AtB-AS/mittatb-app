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
import {formatNumberToString} from '@atb/utils/numbers';

export const MobilityTexts = {
  formFactor: (formFactor: FormFactor) => {
    switch (formFactor) {
      case FormFactor.Scooter:
        return _('El-sparkesykkel', 'E-scooter', 'El-sparkesykkel');
      case FormFactor.Bicycle:
        return _('Sykkel', 'Bicycle', 'Sykkel');
      case FormFactor.Car:
        return _('Bildeling', 'Car sharing', 'Bildeling');
      default:
        return _('Annet', 'Other', 'Annet');
    }
  },
  photo: {
    header: _(
      'Ta bilde av el-sparkesykkelen',
      'Take a photo of the escooter',
      'Ta eit bilde av el-sparkesykkelen',
    ),
    subHeader: _(
      'Hold ca. 5 meter avstand. Unngå folk i bildet',
      'Keep a distence of 5 meters. Avoid capturing people in the photo',
      'Hold ca. 5 meter avstand. Unngå folk i bildet',
    ),
  },
  shmoRequirements: {
    loginBlocker: _('Logg inn', 'Log in', 'Logg inn'),
    loginBlockerInfoMessage: _(
      'Du må logge inn og gå igjennom noen steg for å starte turen',
      'You need to log in and go through some steps to start the trip',
      'Du må logge inn og gå igjennom nokre steg for å starte turen',
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
        return _('Sykkelparkering', 'Bike parking', 'Sykkelparkering');
      case 'car':
      default:
        return _('Bilparkering', 'Car parking', 'Bilparkering');
    }
  },
  disclaimer: _(
    'Betaling eller andre vilkår kan gjelde på denne innfartsparkeringen',
    'Payment or other terms and conditions may apply to this parking',
    '',
  ),
  capacity: _('Plasser totalt', 'Parking spaces', 'Plassar totalt'),
  unknownCapacity: _(
    'Ukjent antall plasser',
    'Unknown number of spaces',
    'Ukjend antal plassar',
  ),
};

export const GeofencingZoneExplanations: GeofencingZoneExplanationsType = {
  allowed: {
    title: _('Tillatt område', 'Allowed Area', 'Tillatt område'),
    description: _(
      'Her kan du både kjøre og parkere',
      'Here you can both drive and park',
      'Her kan du både køyre og parkere',
    ),
  },
  slow: {
    title: _('Saktesone', 'Slow Zone', 'Saktesone'),
    description: _(
      'Farten blir redusert i dette området',
      'The speed will be reduced in this area',
      'Farta vert redusert i dette området',
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
    title: _(
      'Parkering forbudt-sone',
      'No Parking Zone',
      'Parkering forboden-sone',
    ),
    description: _(
      'Du kan ikke parkere i dette området',
      'You cannot park in this area',
      'Du kan ikkje parkere i dette området',
    ),
  },
  noEntry: {
    title: _('Kjøring forbudt-sone', 'No Riding Zone', 'Kjøring forboden-sone'),
    description: _(
      'Du kan ikke kjøre inn i dette området',
      'You cannot ride in this area',
      'Du kan ikkje køyre inn i dette området',
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
    'Se etter parkeringssoner i kartet.',
  ),
};
