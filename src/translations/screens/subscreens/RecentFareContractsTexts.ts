import {translation as _} from '../../commons';

const RecentFareContractsTexts = {
  titles: {
    travellers: _('Reisende', 'Travellers', 'Reisande'),
    zone: _('Sone', 'Zone', 'Sone'),
    duration: _('Gyldighet', 'Validity', 'Gyldigheit'),
    days: _('dager', 'days', 'dagar'),
    hours: _('timer', 'hours', 'timar'),
    moreTravelers: _(
      'andre kategorier',
      'other categories',
      'andre kategoriar',
    ),
    loading: _(
      'Laster tidligere kjøp',
      'Loading recent purchases',
      'Lastar tidlegare kjøp',
    ),
  },
  a11yPreLabels: {
    zones: {
      oneZone: _('i sone: ', 'in zone:', 'i sone:'),
      multipleZones: _(
        'mellom følgende soner:',
        'between the following zones:',
        'mellom følgjande soner:',
      ),
    },
    transportModes: _(
      'vil være gyldig for transportmidlene: ',
      'will be valid for the transport modes: ',
      'vil vere gyldig for transportmidlane: ',
    ),
    travellers: _(
      'for følgende reisende: ',
      'for the following travellers: ',
      'for følgjande reisande: ',
    ),
    and: _(' og ', ' and ', ' og '),
  },
  options: {
    now: _('Nå', 'Now', 'No'),
    futureDate: _(
      'Fremtidig starttidspunkt',
      'Future start time',
      'Framtidig starttidspunkt',
    ),
  },
  primaryButton: _('Bekreft valg', 'Confirm selection', 'Bekreft val'),
  repeatPurchase: {
    label: _('Gjenta kjøp', 'Repeat purchase', 'Gjenta kjøp'),
    a11yHint: _(
      'Aktivér for å gjenta kjøp',
      'Activate to repeat purchase',
      'Aktivér for å gjenta kjøp',
    ),
  },
  ticketTypes: {
    carnet: _('Klippekort', 'Carnet', 'Klippekort'),
    period: _('Periodebillett', 'Period ticket', 'Periodebillett'),
    single: _('Enkeltbillett', 'Single ticket', 'Enkeltbillett'),
  },
};
export default RecentFareContractsTexts;
