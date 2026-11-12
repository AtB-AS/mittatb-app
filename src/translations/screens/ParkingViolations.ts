import {translation as _} from '../commons';

export const ParkingViolationTexts = {
  selectViolation: {
    title: _(
      'Rapporter feilparkering',
      'Report parking violation',
      'Rapporter feilparkering',
    ),
    violationDescription: (code: string) => {
      switch (code) {
        case 'no_parking':
          return _(
            'Forbudsområde / privat tomt',
            'Restricted area / private property',
            'Forbodsområde / privat tomt',
          );
        case 'blocks_walkway':
          return _(
            'Sperrer for gående',
            'Blocks walkway',
            'Sperrar for gåande',
          );
        case 'blocks_traffic':
          return _('Hindrer trafikk', 'Blocks traffic', 'Blokkerar trafikk');
        case 'fallen':
          return _('Har veltet', 'Has fallen', 'Har velta');
        case 'in_water':
          return _('Er i vann', 'Is in water', 'Er i vatn');
        case 'other_issue':
        default:
          return _('Andre feil', 'Other', 'Andre feil');
      }
    },
    nextButton: _('Neste', 'Next', 'Neste'),
  },
  photo: {
    title: _(
      'Ta bilde av elsparkesykkelen',
      'Take a photo of the e-scooter',
      'Ta bilete av elsparkesykkelen',
    ),
    instruction: _(
      'Hold ca. 5 meter avstand. Unngå folk i bildet',
      'Stand approximately 5 meters away. Avoid people in the frame',
      'Hald ein avstand på ca. 5 meter. Unngå folk i biletet',
    ),
  },
  qr: {
    title: _('Skann QR-kode', 'Scan the QR code', 'Skann QR-kode'),
    instructions: _(
      'QR-koden på sykkelstyret inneholder informasjon om merke og registreringsnummer på sparkesykkelen.',
      'The QR code on the handlebars contains information about brand and id of the scooter',
      'QR-koden på sykkelstyret inneheld informasjon om merke og registreringsnummer på sparkesykkelen.',
    ),
    scanningNotPossible: _(
      'Ikke mulig å skanne',
      'Not possible to scan',
      'Ikkje mogleg å skanne',
    ),
  },
  selectProvider: {
    title: _('Velg leverandør', 'Select provider', 'Velg leverandør'),
    confirm: _(
      'Bekreft og send inn rapport',
      'Confirm and submit report',
      'Bekreft og send inn rapport',
    ),
    description: _(
      'Hvis QR-koden ikke er mulig å scanne kan du oppgi utleiefirmaet manuelt.',
      'If the QR code cannot be scanned, you can enter the provider manually.',
      'Om QR-kode ikkje let seg scanne kan du oppgje utleigefirmaet manuelt',
    ),
    qrFailedDescription: _(
      'Klarte ikke å gjenkjenne QR-koden, men du kan oppgi utleiefirma manuelt.',
      "Couldn't recognize the QR code, but you can enter the provider manually.",
      'Klarte ikkje å kjenne igjen QR-koden, men du kan velje utleigefirmaet manuelt.',
    ),
    unknownProvider: _('Ukjent firma', 'Unknown provider', 'Ukjend firma'),
  },
  vehicleLookup: {
    title: _('Sparkesykkel funnet', 'Scooter found', 'Sparkesykkel funnen'),
  },
  confirmation: {
    title: _(
      'Feilparkering rapportert',
      'Report sent',
      'Feilparkering rapportert',
    ),
    description: (providerName?: string) =>
      _(
        `Feilparkeringen er sendt til ${
          providerName ?? 'operatøren'
        } og til kommunen.`,
        `The report is sent to ${
          providerName ?? 'the provider'
        } and the municipality.`,
        `Feilparkeringa er sendt til ${
          providerName ?? 'operatøren'
        } og til kommunen.`,
      ),
  },
  issue: {
    general: {
      message: _(
        'Klarte ikke å starte feilrapporteringen. Prøv igjen senere, eller kontakt kundeservice for hjelp.',
        "Couldn't start the error reporting. Please try again later, or contact customer service for assistance.",
        'Klarte ikkje å starte feilrapporteringa. Prøv igjen seinare, eller kontakt kundeservice for hjelp.',
      ),
    },
    positionNotGranted: {
      title: _(
        'Du har blokkert posisjonsdeling',
        'You have blocked location sharing',
        'Du har blokkert posisjonsdeling',
      ),
      message: _(
        'For å rapportere feilparkering må du gi tilgang til din posisjon.',
        'To report illegal parking, you must provide access to your location.',
        'For å rapportere feilparkering må du tillate deling av posisjonen din',
      ),
      action: _('Gi tilgang', 'Grant access', 'Gje tilgang'),
    },
    noLocation: {
      message: _(
        'Klarte ikke å finne posisjonen din. Prøv å bevege deg litt. Lukk appen og åpne den på nytt dersom problemet ikke løser seg.',
        "Couldn't obtain your position. Try to move around a bit. Close the app, and open it again if the problem persists.",
        'Klarte ikkje å finne posisjonen din. Prøv å bevege deg litt. Lukk appen og åpne han på nytt om problemet ikkje løyser seg.',
      ),
    },
    sendReport: {
      message: _(
        'Klarte ikke å sende feilrapporteringen. Prøv igjen, eller kontakt kundeservice for hjelp.',
        "Couldn't submit the error report. Please try again or contact customer service for assistance.",
        'Klarte ikkje å sende feilrapporteringa. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
    },
  },
};
