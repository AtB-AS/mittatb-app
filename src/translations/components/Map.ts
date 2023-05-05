import {translation as _} from '../commons';

const MapTexts = {
  exitButton: {
    a11yLabel: _('Gå tilbake', 'Go back'),
  },
  startPoint: {
    label: _('Start', 'Start'),
  },
  endPoint: {
    label: _('Slutt', 'End'),
  },
  showTrip: {
    label: _('Vis reiserute i kart', 'Show trip in map'),
  },
  disabledForScreenReader: {
    title: _('Kart kan ikke vises', 'Map cannot be viewed'),
    description: _(
      'Kart er ikke synlig når du bruker skjermleser.',
      'The map is not visible while using screen reader.',
    ),
  },
};
export default MapTexts;
