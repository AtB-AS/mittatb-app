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
      'Ta bilde av sykkelen',
      'Take a photo of the bike',
      'Ta bilete av sykkelen',
    ),
    instruction: _(
      'Hold ca. 5 meter avstand. Unngå folk i bildet.',
      'Stand approximately 5 meters away. Avoid people in the frame',
      '"Hald ein avstand på omtrent 5 meter. Unngå folk i biletet',
    ),
  },
  imageConfirmation: {
    title: _(
      'Er du fornøyd med bildet?',
      'Are you satisfied with the photo?',
      'Er du nøgd med biletet?',
    ),
    confirmButton: _('Ja', 'Yes', 'Ja'),
    retryButton: _('Ta nytt bilde', 'Retake photo', 'Ta nytt bilete'),
  },
  qr: {
    title: _('Skann QR-kode', 'Scan the QR code', 'Skann QR-kode'),
    instructions: _(
      'QR-koden på sykkelstyret innholder informasjon om merke og registreringsnummer på sparkesykkelen.',
      'The QR code on the handlebars contains information about brand and id of the scooter',
      'QR-koden på sykkelstyret inneheld informasjon om merke og registreringsnummer på sparkesykkelen.',
    ),
    scanningNotPossible: _(
      'Ikke mulig å scanne',
      'Not possible to scan',
      'Ikkje mogleg å scanne',
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
      'Vi kjenner dessverre ikke igjen QR-koden, men du kan oppgi utleieiefirma manuelt.',
      'Unfortunately, we do not recognize the QR code, but you can enter the provider manually.',
      'Dessverre kjenner vi ikkje igjen QR-koden, men du kan velje utleigefirmaet manuelt.',
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
      title: _('Oops!', 'Oops!', 'Oops!'),
      message: _(
        'Vi fikk ikke til å starte feilrapporteringen denne gangen.',
        'We were unable to start the error reporting this time',
        'Vi fekk ikkje til å starte feilrapporteringa denne gongen.',
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
      title: _('Oops!', 'Oops!', 'Oops!'),
      message: _(
        'Vi fikk ikke til å finne posisjonen din. Prøv å bevege deg litt. Lukk appen og åpne den på nytt dersom problemet ikke løser seg.',
        'We were unable to obtain your position. Try to move around a bit. Close the app, and open it again if the problem persists.',
        'Vi fekk ikkje til å finne posisjonen din. Prøv å bevege deg litt. Lukk appen og åpne han på nytt om problemet ikkje løyser seg.',
      ),
    },
    sendReport: {
      title: _('Oops!', 'Oops!', 'Oops!'),
      message: _(
        'Vi fikk ikke til å sende feilrapporteringen',
        'We were unable to submit the error report',
        'Vi fekk ikkje til å sende feilrapporteringa.',
      ),
    },
  },
};
