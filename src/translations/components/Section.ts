import {translation as _} from '../commons';

const SectionTexts = {
  LocationInputSectionItem: {
    myPosition: _('Min posisjon', 'My position', 'Min posisjon'),
    updatingLocation: _(
      'Oppdaterer posisjon',
      'Updating location',
      'Oppdaterer posisjon',
    ),
    placeholder: _(
      'Sted eller adresse',
      'Place or address',
      'Stad eller adresse',
    ),
    a11yValue: (currentLocation: string) =>
      _(
        `${currentLocation} er valgt.`,
        `${currentLocation} is selected.`,
        `${currentLocation} er vald.`,
      ),
  },
  expandableSectionItem: {
    a11yHint: {
      expand: _('Aktiver for å vise', 'Activate to show', 'Aktiver for å vise'),
      contract: _(
        'Aktiver for å skjule',
        'Activate to hide',
        'Aktiver for å skjule',
      ),
    },
    iconText: {
      expand: _('Vis', 'Show', 'Vis'),
      contract: _('Skjul', 'Hide', 'Skjul'),
    },
  },
  textInput: {
    clear: _('Tøm redigeringsfelt', 'Clear input', 'Tøm redigeringsfelt'),
    closeKeyboard: _('Lukker tastatur', 'Closing keyboard', 'Lukkar tastatur'),
  },
  phoneInput: {
    a11yLabel: (prefix: string) =>
      _(
        '+' + prefix + '. Velg for å forandre mobilnummer prefiks.',
        '+' + prefix + '. Select to edit phone number prefix.',
        '+' + prefix + '. Vel for å forandre mobilnummer prefiks.',
      ),
  },
  counterInput: {
    decreaseButton: {
      a11yLabel: (text: string) =>
        _(
          `Reduser antall ${text}`,
          `Decrease quantity ${text}`,
          `Reduser antall ${text}`,
        ),
      a11yHint: (text: string, count: number) =>
        _(
          `Aktivér for å redusere antall ${text} til ${count - 1}`,
          `Activate to reduce quantity ${text} to ${count - 1}`,
          `Aktivér for å redusere tal ${text} til ${count - 1}`,
        ),
    },
    increaseButton: {
      a11yLabel: (text: string) =>
        _(`Øk antall ${text}`, `Increase quantity ${text}`, `Auk tal ${text}`),
      a11yHint: (text: string, count: number) =>
        _(
          `Aktivér for å øke antall ${text} til ${count + 1}`,
          `Activate to increase quantity ${text} to ${count + 1}`,
          `Aktivér for å auke tal ${text} til ${count + 1}`,
        ),
    },
  },
  favoriteDeparture: {
    from: _('Fra', 'From', 'Frå'),
    allVariations: _(
      'Alle linjevariasjoner',
      'All line variations',
      'Alle linjevariasjonar',
    ),
  },
  toggleInput: {
    disabled: _('Deaktivert', 'Disabled', 'Deaktivert'),
  },
};
export default SectionTexts;
