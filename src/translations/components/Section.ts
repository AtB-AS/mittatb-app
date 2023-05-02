import {translation as _} from '../commons';

const SectionTexts = {
  LocationInputSectionItem: {
    myPosition: _('Min posisjon', 'My position'),
    updatingLocation: _('Oppdaterer posisjon', 'Updating location'),
    placeholder: _('Sted eller adresse', 'Place or address'),
    a11yValue: (currentLocation: string) =>
      _(`${currentLocation} er valgt.`, `${currentLocation} is selected.`),
  },
  dateInput: {
    label: _('Dato', 'Date'),
  },
  timeInput: {
    label: _('Tid', 'Time'),
  },
  expandableSectionItem: {
    a11yHint: {
      expand: _('Aktiver for å vise', 'Activate to show'),
      contract: _('Aktiver for å skjule', 'Activate to hide'),
    },
    iconText: {
      expand: _('Vis', 'Show'),
      contract: _('Skjul', 'Hide'),
    },
  },
  textInput: {
    clear: _('Tøm redigeringsfelt', 'Clear input'),
    closeKeyboard: _('Lukker tastatur', 'Closing keyboard'),
  },
  phoneInput: {
    a11yLabel: (prefix: string) =>
      _(
        '+' + prefix + '. Velg for å forandre mobilnummer prefiks.',
        '+' + prefix + '. Select to edit phone number prefix.',
      ),
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
    allVariations: _('Alle linjevariasjoner', 'All line variations'),
  },
};
export default SectionTexts;
