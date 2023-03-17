import {translation as _} from '../../commons';

const RecentFareContractsTexts = {
  titles: {
    travellers: _('Reisende', 'Travellers'),
    zone: _('Sone', 'Zone'),
    duration: _('Gyldighet', 'Validity'),
    days: _('dager', 'days'),
    hours: _('timer', 'hours'),
    moreTravelers: _('andre kategorier', 'other categories'),
    loading: _('Laster tidligere kjøp', 'Loading recent purchases'),
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
  options: {
    now: _('Nå', 'Now'),
    futureDate: _('Fremtidig starttidspunkt', 'Future start time'),
  },
  primaryButton: _('Bekreft valg', 'Confirm selection'),
  repeatPurchase: {
    label: _('Gjenta kjøp', 'Repeat purchase'),
    a11yHint: _('Aktivér for å gjenta kjøp', 'Activate to repeat purchase'),
  },
  ticketTypes: {
    carnet: _('Klippekort', 'Carnet'),
    period: _('Periodebillett', 'Period ticket'),
    single: _('Enkeltbilett', 'Single ticket'),
  },
};
export default RecentFareContractsTexts;
