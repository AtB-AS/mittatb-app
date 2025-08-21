import {translation as _} from '../../commons';

const SmartParkAndRideTexts = {
  header: {
    title: _(
      'Parkering på Ranheim',
      'Parking at Ranheim',
      'Parkering på Ranheim',
    ),
  },
  content: {
    heading: _('Dine kjøretøy', 'Your vehicles', 'Dine køyretøy'),
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
    link: _('Sånn funker det', 'How it works', 'Slik fungerer det'),
  },
  add: {
    header: {
      title: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
    },
    content: {
      title: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
      text: _(
        'Skriv inn skiltnummer og valgfritt navn. Du kan legge til maks to kjøretøy.',
        'Enter license plate and optional name. You can add a maximum of two vehicles.',
        'Skriv inn skiltnummer og valfritt namn. Du kan leggje til maks to køyretøy.',
      ),
    },
    max: _(
      'Du kan legge til maks to kjøretøy',
      'You can add a maximum of two vehicles',
      'Du kan leggje til maks to køyretøy',
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
        label: _('Skiltnummer', 'License plate', 'Skiltnummer'),
        placeholder: _(
          'Skriv inn skiltnummer',
          'Enter license plate',
          'Skriv inn skiltnummer',
        ),
        vehicleNotFound: {
          title: _(
            'Vi finner ikke skiltnummeret',
            'We cannot find the license plate',
            'Vi finn ikkje skiltnummeret',
          ),
          message: _(
            'Hvis du har utenlandske skilter kan du legge det til likevel.',
            'If you have foreign license plates, you can add it anyway.',
            'Om du har utanlandske skilt kan du leggje det til likevel.',
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
        label: _('Skiltnummer', 'License plate', 'Skiltnummer'),
        placeholder: _(
          'Skriv inn skiltnummer',
          'Enter license plate',
          'Skriv inn skiltnummer',
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
        'Billett gir gratis parkering',
        'Ticket gives free parking',
        'Billett gir gratis parkering',
      ),
      description: _(
        'Stå gratis på Ranheim Fabrikker i 48 timer, uansett hvilken AtB-billett du har. Billetten må være aktiv senest 30 minutter etter innkjøring.',
        'Park for free at Ranheim Fabrikker for 48 hours, regardless of which AtB ticket you have. The ticket must be active at least 30 minutes after entering.',
        'Stå gratis på Ranheim Fabrikker i 48 timar, uansett kva AtB-billett du har. Billetten må vere aktiv seinast 30 minutt etter innkjøring.',
      ),
      penaltyNotice: _(
        'Uten billett er det fast pris på 400 kr.',
        'Without a ticket, there is a fixed price of 400 NOK.',
        'Utan billett er det fast pris på 400 kr.',
      ),
      buttonText: _(
        'Hvordan gjør vi det?',
        'How do we do it?',
        'Korleis gjer vi det?',
      ),
    },
    automaticRegistration: {
      title: _(
        'Automatisk registrering',
        'Automatic registration',
        'Automatisk registrering',
      ),
      description: _(
        'Kjøretøyet registrer seg automatisk ved inn- og utkjøring, og vi sjekker i appen om du har billett. Legg til kjøretøyet ditt for å knytte billetten til parkeringen.',
        'The vehicle automatically registers upon entering and exiting, and we check the app for your ticket. Add your vehicle to link the ticket to the parking.',
        'Køyretøyet registrer seg automatisk ved inn- og utkjøring, og vi sjekker i appen om du har billett. Legg til køyretøyet ditt for å knytte billetten til parkeringen.',
      ),
      descriptionLink: {
        text: _(
          'Les mer på atb.no/RanheimFabrikker',
          'Read more at atb.no/RanheimFabrikker',
          'Les meir på atb.no/RanheimFabrikker',
        ),
        a11yHint: _(
          'Les mer på atb.no/RanheimFabrikker',
          'Read more at atb.no/RanheimFabrikker',
          'Les meir på atb.no/RanheimFabrikker',
        ),
      },
      buttonText: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
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
