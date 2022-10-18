import {translation as _} from '../commons';

const MapTexts = {
  exitButton: {
    a11yLabel: _('Gå tilbake', 'Go back'),
  },
  expandButton: {
    label: _('Utvid kart', 'Expand map'),
  },
  startPoint: {
    label: _('Start', 'Start'),
  },
  endPoint: {
    label: _('Slutt', 'End'),
  },
  controls: {
    zoomIn: {
      a11yLabel: _('Zoom inn', 'Zoom in'),
    },
    zoomOut: {
      a11yLabel: _('Zoom ut', 'Zoom out'),
    },
    position: {
      a11yLabel: _('Min posisjon', 'My location'),
      a11yHint: _(
        'Aktivér for å gå til din gjeldende posisjon',
        'Activate to use your current position',
      ),
    },
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
