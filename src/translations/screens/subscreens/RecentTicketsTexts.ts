import {translation as _} from '../../commons';

const RecentTicketsTexts = {
  titles: {
    travellers: _('Reisende', 'Travellers'),
    zone: _('Sone', 'Zone'),
    duration: _('Gyldighet', 'Validity'),
    days: _('dager', 'days'),
    hours: _('timer', 'hours'),
    moreTravelers: _('andre', 'others'),
  },
  a11yPreLabels: {
    zones: {
      oneZone: _('i sone: ', 'in zone:'),
      multipleZones: _(
        'mellom følgende soner:',
        'between the following zones:',
      ),
    },
    transportModes: _(
      'vil være gyldig for transportmidlene: ',
      'will be valid for the transport modes: ',
    ),
    travellers: _('for følgende reisende: ', 'for the following travellers: '),
    and: _(' og ', ' and '),
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
    several: _('Flere reisemåter', 'Several transport modes'),
  },
  options: {
    now: _('Nå', 'Now'),
    futureDate: _('Fremtidig starttidspunkt', 'Future start time'),
  },
  primaryButton: _('Bekreft valg', 'Confirm selection'),
  repeatPurchase: _('Gjenta kjøp', 'Repeat purchase'),
  ticketTypes: {
    carnet: _('Klippekort', 'Carnet'),
    period: _('Periodebillett', 'Period ticket'),
    single: _('Enkeltbilett', 'Single ticket'),
  },
};
export default RecentTicketsTexts;
