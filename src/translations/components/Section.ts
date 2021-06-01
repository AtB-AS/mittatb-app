import {translation as _} from '../commons';

const SectionTexts = {
  locationInput: {
    myPosition: _('Min posisjon', 'My current position'),
    updatingLocation: _('Oppdaterer posisjon', 'Updating current location'),
    placeholder: _(
      'Søk etter adresse eller sted',
      'Search for an address or location',
    ),
    a11yValue: (currentLocation: string) =>
      _(`${currentLocation} er valgt.`, `${currentLocation} is selected.`),
  },
  dateInput: {
    label: _('Dato', 'Date'),
  },
  timeInput: {
    label: _('Tid', 'Time'),
  },
  actionItem: {
    headingExpand: {
      toggle: {
        expand: _('Vis', 'Show'),
        contract: _('Skjul', 'Hide'),
      },
    },
  },
  textInput: {
    clear: _('Tøm redigeringsfelt', 'Clear input'),
    closeKeyboard: _('Lukker tastatur', 'Closing keyboard'),
  },
  counterInput: {
    decreaseButton: {
      a11yLabel: (text: string) =>
        _(`Reduser antall ${text}`, `Decrease quantity ${text}`),
      a11yHint: (text: string, count: number) =>
        _(
          `Aktivér for å redusere antall ${text} til ${count - 1}`,
          `Activate to reduce quantity ${text} to ${count - 1}`,
        ),
    },
    increaseButton: {
      a11yLabel: (text: string) =>
        _(`Øk antall ${text}`, `Increase quantity ${text}`),
      a11yHint: (text: string, count: number) =>
        _(
          `Aktivér for å øke antall ${text} til ${count + 1}`,
          `Activate to increase quantity ${text} to ${count + 1}`,
        ),
    },
  },
  favoriteDeparture: {
    from: _('Fra', 'From'),
  },
};
export default SectionTexts;
