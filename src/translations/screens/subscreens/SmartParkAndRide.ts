import {translation as _} from '../../commons';

const SmartParkAndRideTexts = {
  header: {
    title: _('Innfartsparkering', 'Park and Ride', 'Innfartsparkering'),
  },
  content: {
    heading: (num: number) =>
      _(
        `Dine kjøretøy (${num}/2)`,
        `Your vehicles (${num}/2)`,
        `Dine køyretøy (${num}/2)`,
      ),
    addVehicle: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
  },
  howItWorks: {
    heading: _('Les mer', 'Read more', 'Les meir'),
    title: _('Hvordan funker det?', 'How does it work?', 'Korleis funkar det?'),
    description: _(
      'Med gyldig billett fra AtB kan du stå gratis på Ranheim Fabrikker i 48 timer.',
      'With a valid ticket from AtB, you can park for free at Ranheim Fabrikker for 48 hours.',
      'Med gyldig billett frå AtB kan du stå gratis på Ranheim Fabrikker i 48 timar.',
    ),
    link: _('Les mer', 'Read more', 'Les meir'),
  },
  add: {
    header: {
      title: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
    },
    content: {
      title: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
      text: _(
        'Skriv inn registreringsnummer og valgfritt navn. Du kan legge til maks to kjøretøy.',
        'Enter license plate and optional name. You can add a maximum of two vehicles.',
        'Skriv inn registreringsnummer og valfritt namn. Du kan leggje til maks to køyretøy.',
      ),
    },
    max: _(
      'Du kan legge til maks to kjøretøy.',
      'You can add a maximum of two vehicles.',
      'Du kan leggje til maks to køyretøy.',
    ),
    inputs: {
      nickname: {
        label: _('Navn', 'Name', 'Namn'),
        placeholder: _(
          'Skriv inn valgfritt navn',
          'Enter optional name',
          'Skriv inn valfritt namn',
        ),
      },
      licensePlate: {
        label: _('Registreringsnummer', 'License plate', 'Registreringsnummer'),
        placeholder: _(
          'Skriv inn registreringsnummer',
          'Enter license plate',
          'Skriv inn registreringsnummer',
        ),
        vehicleNotFound: {
          title: _(
            'Ingen treff på registreringsnummer',
            'No vehicle found for license plate',
            'Ingen treff på registreringsnummer',
          ),
          message: _(
            'Dette kan skyldes utenlandsk registreringsnummer. Du kan legge til kjøretøyet likevel.',
            'This may be due to a foreign license plate. You can add the vehicle anyway.',
            'Dette kan skuldast utanlandsk registreringsnummer. Du kan leggje til køyretøyet likevel.',
          ),
        },
      },
    },
    footer: {
      add: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
      later: _('Gjør det senere', 'Do it later', 'Gjer det seinare'),
    },
  },
  edit: {
    header: {
      title: _('Endre kjøretøy', 'Edit vehicle', 'Endre køyretøy'),
    },
    inputs: {
      nickname: {
        label: _('Navn', 'Name', 'Namn'),
        placeholder: _(
          'Skriv inn valgfritt navn',
          'Enter optional name',
          'Skriv inn valfritt namn',
        ),
      },
      licensePlate: {
        label: _('Registreringsnummer', 'License plate', 'Registreringsnummer'),
        placeholder: _(
          'Skriv inn registreringsnummer',
          'Enter license plate',
          'Skriv inn registreringsnummer',
        ),
      },
    },
    button: _('Lagre', 'Save', 'Lagre'),
    error: _(
      'Vi klarte ikke lagre endringer. Prøv igjen.',
      'We could not save changes. Please try again.',
      'Vi klarte ikkje lagre endringar. Prøv igjen.',
    ),
    delete: {
      button: _('Fjern kjøretøy', 'Remove vehicle', 'Fjern køyretøy'),
      confirmation: {
        title: _('Fjern kjøretøy', 'Remove vehicle', 'Fjern køyretøy'),
        message: _(
          'Ønsker du å fjerne dette kjøretøyet?',
          'Do you wish to remove this vehicle?',
          'Ønsker du å fjerne dette køyretøyet?',
        ),
        cancel: _('Avbryt', 'Cancel', 'Avbryt'),
        confirm: _('Fjern', 'Remove', 'Fjern'),
      },
      error: _(
        'Vi klarte ikke fjerne kjøretøyet. Prøv igjen.',
        'We could not remove the vehicle. Please try again.',
        'Vi klarte ikkje fjerne køyretøyet. Prøv igjen.',
      ),
    },
  },
  errors: {
    invalidLicensePlate: _(
      'Ugyldig registreringsnummer. Registreringsnummeret må ha 2-14 tegn.',
      'Invalid license plate. The license plate must have 2-14 characters.',
      'Ugyldig registreringsnummer. Registreringsnummeret må ha 2-14 teikn.',
    ),
    vehicleAlreadyAdded: _(
      'Dette kjøretøyet er allerede lagt til.',
      'This vehicle has already been added.',
      'Dette køyretøyet er allereie lagt til.',
    ),
    maximumNumberOfVehiclesReached: _(
      'Du kan ikke legge til flere kjøretøy. Du kan legge til maks to kjøretøy.',
      'You cannot add more vehicles. You can add a maximum of two vehicles.',
      'Du kan ikkje leggje til fleire køyretøy. Du kan leggje til maks to køyretøy.',
    ),
    unknown: _(
      'Noe gikk galt. Prøv igjen.',
      'Something went wrong. Please try again.',
      'Noko gjekk gale. Prøv igjen.',
    ),
  },
  a11y: {
    carIcon: _('Bilikon', 'Car icon', 'Bilikon'),
    button: _(
      'Trykk for å redigere eller fjerne kjøretøy',
      'Press to edit or remove vehicle',
      'Trykk for å redigere eller fjerne køyretøy',
    ),
  },
  onboarding: {
    information: {
      title: _(
        'Bussbillett gir gratis parkering',
        'Bus ticket gives free parking',
        'Bussbillett gir gratis parkering',
      ),
      description: _(
        'Nå kan du parkere gratis på Ranheim Fabrikker i opptil 48 timer med en gyldig bussbillett i AtB-appen. Billetten må ha vært aktiv i løpet av tiden du har stått parkert.',
        'Now you can park for free at Ranheim Fabrikker for up to 48 hours with a valid bus ticket in the AtB app. The ticket must have been active during the time you were parked.',
        'No kan du parkere gratis på Ranheim Fabrikker i opptil 48 timar med ein gyldig bussbillett i AtB-appen. Billetten må ha vore aktiv i løpet av tida du har stått parkert.',
      ),
      buttonText: _(
        'Registrering av kjøretøy i appen',
        'Registering vehicles in the app',
        'Registrering av køyretøy i appen',
      ),
    },
    automaticRegistration: {
      title: _(
        'Registrering av kjøretøy i appen',
        'Registering vehicles in the app',
        'Registrering av køyretøy i appen',
      ),
      description: _(
        'Du trenger bare å registrere kjøretøyet én gang i AtB-appen. Når det er gjort, blir kjøretøyet knyttet til profilen din. Du kan ha opptil to kjøretøy registrert per profil.',
        'You only need to register the vehicle once in the AtB app. Once done, the vehicle will be linked to your profile. You can have up to two vehicles registered per profile.',
        'Du treng berre å registrere køyretøyet éin gong i AtB-appen. Når det er gjort, blir køyretøyet knytt til profilen din. Du kan ha opptil to køyretøy registrert per profil.',
      ),
      descriptionLink: {
        text: _(
          'Les mer på atb.no',
          'Read more at atb.no',
          'Les meir på atb.no',
        ),
        a11yHint: _(
          'Les mer på atb.no',
          'Read more at atb.no',
          'Les meir på atb.no',
        ),
      },
      buttonText: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
    },
    contactInfo: {
      title: _('Spørsmål?', 'Questions?', 'Spørsmål?'),
      telephone: (tel: string) =>
        _(`tlf. ${tel}`, `tel. ${tel}`, `tlf. ${tel}`),
      parking: {
        heading: _('Om parkeringen', 'About the parking', 'Om parkeringa'),
        subheading: _(
          'Kontakt Trondheim Parkering',
          'Contact Trondheim Parking',
          'Kontakt Trondheim Parkering',
        ),
      },
      project: {
        heading: _('Om prosjektet', 'About the project', 'Om prosjektet'),
        subheading: _(
          'Kontakt Trøndelag fylkeskommune',
          'Contact Trøndelag County Municipality',
          'Kontakt Trøndelag fylkeskommune',
        ),
      },
      about: {
        heading: _(
          'Om AtB-appen og billetter',
          'About the AtB app and tickets',
          'Om AtB-appen og billettar',
        ),
        link: _('atb.no/kontakt', 'atb.no/kontakt', 'atb.no/kontakt'),
      },
      buttonText: _('Lukk', 'Close', 'Lukk'),
      close: _('Ferdig', 'Done', 'Ferdig'),
    },
  },
  notLoggedIn: {
    title: _(
      'Du er ikke logget inn',
      'You are not logged in',
      'Du er ikkje logga inn',
    ),
    message: _(
      'Hvis du logger inn i appen senere, må du registrere alle kjøretøy på nytt.',
      'If you log in to the app later, you will need to register all vehicles again.',
      'Om du loggar inn i appen seinare, må du registrere alle køyretøy på nytt.',
    ),
  },
};

export default SmartParkAndRideTexts;
