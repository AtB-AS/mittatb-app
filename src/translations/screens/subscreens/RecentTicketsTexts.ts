import {translation as _} from '../../commons';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

const RecentTicketsTexts = {
  titles: {
    travellers: _('Reisende', 'Travellers'),
    zone: _('Sone', 'Zone'),
    duration: _('Gyldighet', 'Validity'),
    days: _('dager', 'days'),
    hours: _('timer', 'hours'),
    moreTravelers: _('andre', 'others'),
  },
  transportMode: (mode: Mode) => {
    switch (mode) {
      case Mode.Bus:
        return _('buss', 'bus');
      case Mode.Rail:
        return _('tog', 'train');
      case Mode.Tram:
        return _('trikk', 'tram');
      case Mode.Water:
        return _('båt', 'boat');
      case Mode.Air:
        return _('fly', 'plane');
      case Mode.Foot:
        return _('gange', 'walk');
      case Mode.Metro:
        return _('T-bane', 'metro');
      default:
        return _('ukjent transportmiddel', 'unknown transport');
      /*
                bus: _('buss', 'bus'),
                rail: _('tog', 'train'),
                tram: _('trikk', 'tram'),
                water: _('båt', 'boat'),
                air: _('fly', 'plane'),
                foot: _('gange', 'walk'),
                metro: _('T-bane', 'metro'),
                unknown: _('ukjent transportmiddel', 'unknown transport'),
                several: _('Flere reisemåter', 'Several transport modes'),
                */
    }
  },
  severalTransportModes: _('ukjent transportmiddel', 'unknown transport'),
  options: {
    now: _('Nå', 'Now'),
    futureDate: _('Fremtidig starttidspunkt', 'Future start time'),
  },
  primaryButton: _('Bekreft valg', 'Confirm selection'),
  ticketTypes: {
    carnet: _('Klippekort', 'Carnet'),
    period: _('Periodebillett', 'Period ticket'),
    single: _('Enkeltbilett', 'Single ticket'),
  },
};
export default RecentTicketsTexts;
