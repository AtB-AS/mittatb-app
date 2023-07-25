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
  singleChild: _('Sykkel.', 'Bike.', 'Sykkel.'),
  periodAdult: _('', '', ''),
  periodChild: _(
    'Gyldig på nattbuss.',
    'Valid for night bus.',
    'Gyldig på nattbuss.',
  ),
  periodStudent: _(
    'Gyldig på nattbuss.',
    'Valid for night bus. ',
    'Gyldig på nattbuss.',
  ),
  periodSenior: _(
    'Gyldig på nattbuss.',
    'Valid for night bus.',
    'Gyldig på nattbuss.',
  ),
};

const SpecificExtensions = orgSpecificTranslations(SpecificExtensionsInternal, {
  nfk: {
    singleChild: _('', '', ''),
    periodAdult: _(
      'Gyldig på nattbuss.',
      'Valid for night bus.',
      'Gyldig på nattbuss.',
    ),
  },
  fram: {
    singleChild: _('', '', ''),
    periodChild: _('', '', ''),
    periodStudent: _('', '', ''),
    periodSenior: _('', '', ''),
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
          return _('', '', '');
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
          return _('', '', '');
      }
    default:
      return _('', '', '');
  }
}

function generic(travellerType: string) {
  switch (travellerType) {
    case TravellerType.child:
      return _('6 til og med 19 år.', '6 to 19 years.', '6 til og med 19 år.');
    case TravellerType.adult:
      return _(
        '20 til og med 66 år.',
        '20 to 66 years.',
        '20 til og med 66 år.',
      );
    case TravellerType.student:
      if (APP_ORG === 'atb')
        return _(
          'Fulltidsstudenter og elever under 35 år.',
          'Fulltime students under 35.',
          'Fulltidsstudentar og elevar under 35 år.',
        );
      else
        return _(
          'Fulltidsstudenter og elever under 30 år.',
          'Fulltime students under 30.',
          'Fulltidsstudentar og elevar under 30 år.',
        );
    case TravellerType.senior:
      return _(
        'Over 67 eller med gyldig honnørbevis.',
        'Over 67 or with concessionary card.',
        'Over 67 eller med gyldig honnørbevis.',
      );
    case TravellerType.military:
      return _(
        'Vernepliktig i førstegangstjeneste.',
        'Soldiers in mandatory service.',
        'Vernepliktig i førstegangsteneste.',
      );
    default:
      return _('', '', '');
  }
}

function userProfileDescriptionOverrides(
  travellerType: string,
  ticketType: string | undefined,
) {
  if (ticketType === undefined) return _('', '', '');
  switch (ticketType) {
    case 'travel-pass':
      if (travellerType === TravellerType.adult) {
        return _('Over 16 år', 'Age 16 or older', 'Over 16 år');
      } else if (travellerType === TravellerType.child) {
        return _('Til og med 15 år', 'Age 15 or younger', 'Til og med 15 år');
      }
      return _('', '', '');
    default:
      return _('', '', '');
  }
}

const TicketTravellerTexts = {
  information: (travellerType: string, ticketType: string | undefined) => {
    return (
      specificOverrides(travellerType, ticketType) || generic(travellerType)
    );
  },
  userProfileDescriptionOverride: (
    travellerType: string,
    ticketType: string | undefined,
  ) => {
    return userProfileDescriptionOverrides(travellerType, ticketType);
  },
};

export default TicketTravellerTexts;
