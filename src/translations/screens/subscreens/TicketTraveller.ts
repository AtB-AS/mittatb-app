import {translation as _} from '../../commons';
import {PreassignedFareProductType} from '@atb/reference-data/types';

enum TravellerType {
  adult = 'ADULT',
  senior = 'SENIOR',
  child = 'CHILD',
  student = 'STUDENT',
  military = 'MILITARY',
}

function specificOverrides(
  travellerType: string,
  ticketType: PreassignedFareProductType | undefined,
) {
  if (ticketType == undefined) return false;

  switch (ticketType) {
    case 'single':
      switch (travellerType) {
        case TravellerType.child:
          return _('6 til og med 19 år. Sykkel.', '6 to 19 years. Bike.');
        default:
          return undefined;
      }
    case 'period':
      switch (travellerType) {
        case TravellerType.child:
          return _(
            '6 til og med 19 år. Gjelder på nattbuss.',
            '6 to 19 years. Valid for night bus.',
          );
        case TravellerType.student:
          return _(
            'Fulltidsstudenter og elever under 35 år. Gyldig på nattbuss.',
            'Fulltime students under 35. Valid for night bus. ',
          );
        case TravellerType.senior:
          return _(
            'Over 67 eller med gyldig honnørbevis. Gyldig på nattbuss.',
            'Over 67 or with concessionary card. Valid for night bus.',
          );
        default:
          return undefined;
      }
  }
}

function generic(travellerType: string) {
  switch (travellerType) {
    case TravellerType.child:
      return _('6 til og med 19 år.', '6 to 19 years.');
    case TravellerType.adult:
      return _('20 til og med 66 år', '20 to 66 years.');
    case TravellerType.student:
      return _(
        'Fulltidsstudenter og elever under 35 år',
        'Fulltime students under 35.',
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
  information: (
    travellerType: string,
    ticketType: PreassignedFareProductType | undefined,
  ) => {
    return (
      specificOverrides(travellerType, ticketType) || generic(travellerType)
    );
  },
};

export default TicketTravellerTexts;
