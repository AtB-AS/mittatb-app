import {translation as _} from '../../commons';

const RecentTicketsTexts = {
  titles: {
    travellers: _('Reisende', 'Travellers'),
    zone: _('Sone', 'Zone'),
    duration: _('Varighet', 'Duration'),
    days: _('dager', 'days'),
    hours: _('timer', 'hours'),
  },
  transportModes: {
    bus: _('buss', 'bus'),
    rail: _('tog', 'train'),
    tram: _('trikk', 'tram'),
    water: _('båt', 'boat'),
    air: _('fly', 'plane'),
    foot: _('gange', 'walk'),
    metro: _('T-bane', 'metro'),
    unknown: _('ukjent transportmiddel', 'unknown transport'),
  },
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
