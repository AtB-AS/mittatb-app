import {translation as _} from '../commons';

export const ParkingViolationTexts = {
  selectViolation: {
    title: _('Hva er feil?', 'What is wrong?', 'Kva er feil?'),
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
  },
  loadingError: _(
    'Oops! Vi fikk ikke til å starte feilrapporteringen denne gangen.',
    'Oops! We were unable to start the error reporting this time',
    'Oops! Vi fekk ikkje til å starte feilrapporteringa denne gongen.',
  ),
};
