import {translation as _} from '../../commons';
import {APP_ORG} from '@env';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

enum TravellerType {
  adult = 'ADULT',
  senior = 'SENIOR',
  child = 'CHILD',
  student = 'STUDENT',
  military = 'MILITARY',
}

const SpecificExtensionsInternal = {
  singleChild: _('Sykkel.', 'Bike.'),
  periodAdult: _('', ''),
  periodChild: _('Gyldig på nattbuss.', 'Valid for night bus.'),
  periodStudent: _('Gyldig på nattbuss.', 'Valid for night bus. '),
  periodSenior: _('Gyldig på nattbuss.', 'Valid for night bus.'),
  travelpassAdult: _(
    'For Sommerpass er voksen over 18 år.',
    'For Summer Pass, adults are aged 18 or older.',
  ),
  travelpassChild: _(
    'For Sommerpass er barn under 18 år.',
    'For Summer Pass, children are aged 17 or below.',
  ),
};

const SpecificExtensions = orgSpecificTranslations(SpecificExtensionsInternal, {
  nfk: {
    singleChild: _('', ''),
    periodAdult: _('Gyldig på nattbuss.', 'Valid for night bus.'),
    travelpassAdult: _(
      'For Travel Pass Nordland er voksen over 18 år.',
      'For Travel Pass Nordland, adults are aged 18 or older.',
    ),
    travelpassChild: _(
      'For Travel Pass Nordland er barn til og med 17 år.',
      'For Travel Pass Nordland, children are aged 17 or below.',
    ),
  },
  fram: {
    singleChild: _('', ''),
    periodChild: _('', ''),
    periodStudent: _('', ''),
    periodSenior: _('', ''),
    travelpassAdult: _('', ''),
    travelpassChild: _('', ''),
  },
});

function specificOverrides(
  travellerType: string,
  ticketType: string | undefined,
) {
  if (ticketType == undefined) return false;

  switch (ticketType) {
    case 'single':
      switch (travellerType) {
        case TravellerType.child:
          return SpecificExtensions.singleChild;
        default:
          return _('', '');
      }
    case 'period':
      switch (travellerType) {
        case TravellerType.adult:
          return SpecificExtensions.periodAdult;
        case TravellerType.child:
          return SpecificExtensions.periodChild;
        case TravellerType.student:
          return SpecificExtensions.periodStudent;
        case TravellerType.senior:
          return SpecificExtensions.periodSenior;
        default:
          return _('', '');
      }
    case 'travel-pass':
      switch (travellerType) {
        case TravellerType.adult:
          return SpecificExtensions.travelpassAdult;
        case TravellerType.child:
          return SpecificExtensions.travelpassChild;
        default:
          return _('', '');
      }
    default:
      return _('', '');
  }
}

function generic(travellerType: string) {
  switch (travellerType) {
    case TravellerType.child:
      return _('6 til og med 19 år.', '6 to 19 years.');
    case TravellerType.adult:
      return _('20 til og med 66 år.', '20 to 66 years.');
    case TravellerType.student:
      if (APP_ORG === 'atb')
        return _(
          'Fulltidsstudenter og elever under 35 år.',
          'Fulltime students under 35.',
        );
      else
        return _(
          'Fulltidsstudenter og elever under 30 år.',
          'Fulltime students under 30.',
        );
    case TravellerType.senior:
      return _(
        'Over 67 eller med gyldig honnørbevis.',
        'Over 67 or with concessionary card.',
      );
    case TravellerType.military:
      return _(
        'Vernepliktig i førstegangstjeneste.',
        'Soldiers in mandatory service.',
      );
    default:
      return _('', '');
  }
}

const TicketTravellerTexts = {
  information: (travellerType: string, ticketType: string | undefined) => {
    return (
      specificOverrides(travellerType, ticketType) || generic(travellerType)
    );
  },
};

export default TicketTravellerTexts;
