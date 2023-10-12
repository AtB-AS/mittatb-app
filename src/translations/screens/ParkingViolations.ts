import {translation as _} from '../commons';

export const ParkingViolationTexts = {
  selectViolation: {
    title: _(
      'Rapporter feilparkering av sparkesykkel',
      'Report scooter parking violations',
      'Rapporter feilparkering av sparkesykkel',
    ),
    violationDescription: (code: string) => {
      switch (code) {
        case 'no_parking':
          return _(
            'Forbudsområde / privat tomt',
            'Restricted area / private property',
            'Forbudsområde / privat tomt',
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
        case 'underwater':
          return _('Er i vann', 'Is in water', 'Er i vatn');
        case 'other_issue':
        default:
          return _('Andre feil', 'Other', 'Andre fel');
      }
    },
    nextButton: _('Neste', 'Next', 'Neste'),
  },
  photo: {
    title: _(
      'Ta bilde av sykkelen',
      'Take a photo of the bike',
      'Ta eit billete av sykkelen',
    ),
    instruction: _(
      'Hold ca. 5 meter avstand. Unngå folk i bildet.',
      'Stand approximately 5 meters away. Avoid people in the frame',
      '"Hald ein avstand på omtrent 5 meter. Unngå folk i biletet',
    ),
  },
  qr: {
    title: _(
      'Scan QR-koden på sykkelstyret',
      'Scan the QR code on the handlebars',
      'Scan QR-koden på sykkelstyret',
    ),
    instructions: _(
      'QR-koden innholder informasjon om merke og registreringsnummer på sparkesykkelen.',
      'The QR contains information about brand and id of the scooter',
      'QR-koden inneheld informasjon om merke og registreringsnummer på sparkesykkelen.',
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
  },
  vehicleLookup: {
    title: _('Sparkesykkel funnet', 'Scooter found', 'Sparkesykkel funnen'),
  },
  error: {
    loading: {
      title: _('Oops!', 'Oops!', 'Oops!'),
      message: _(
        'Vi fikk ikke til å starte feilrapporteringen denne gangen.',
        'We were unable to start the error reporting this time',
        'Vi fekk ikkje til å starte feilrapporteringa denne gongen.',
      ),
    },
    position: {
      title: _(
        'Du har blokkert posisjonsdeling',
        'You have blocked location sharing',
        'Du har blokkert posisjonsdeling',
      ),
      message: _(
        'For å rapportere feilparkering må du gi tilgang til din posisjon.',
        'To report illegal parking, you must provide access to your location.',
        'For å rapportera feilparkering må du tillata deling av din posisjon',
      ),
      action: _('Gi tilgang', 'Grant access', 'Gje tilgang'),
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
