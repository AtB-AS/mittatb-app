import {translation as _} from '../commons';

const MapTexts = {
  exitButton: {
    a11yLabel: _('Gå tilbake', 'Go back', 'Gå tilbake'),
  },
  startPoint: {
    label: _('Start', 'Start', 'Start'),
  },
  endPoint: {
    label: _('Slutt', 'End', 'Slutt'),
  },
  disabledForScreenReader: {
    title: _(
      'Kart kan ikke vises',
      'Map cannot be viewed',
      'Kart kan ikkje visast',
    ),
    description: _(
      'Kart er ikke synlig når du bruker skjermleser.',
      'The map is not visible while using screen reader.',
      'Kart er ikkje synleg ved bruk av skjermlesar.',
    ),
  },
  filters: {
    bottomSheet: {
      heading: _('Filter', 'Filter', 'Filter'),
    },
  },
};
export default MapTexts;
