import {translation as _} from '../../commons';

const SelectFavouriteDeparturesText = {
  header: {
    text: _('Velg favorittavganger', 'Select favourite departures'),
  },
  title: {
    text: _(
      'Hvilke favorittavganger vil du vise på forsiden?',
      'Which favourite departures do you want displayed on the front page?',
    ),
  },
  departures: {
    from: _('Fra', 'From'),
    allVariations: _('Alle linjevariasjoner', 'All line variations'),
  },
  switch: {
    a11yhint: _(
      'Aktiver for å vise eller skjule denne favorittavgangen på forsiden',
      'Activate to show or hide this favourite departure on the front page.',
    ),
  },
  noFavourites: {
    text: _(
      'Vi fant ingen favorittavganger. For å legge til en favorittavgang må du aktivere ny avganger-visning, og klikke på stjernen ved siden av en avgang.',
      'We found no departure favourites. To add a favourite departure, you may activate the new Departures-view, and then press the star next to a departure.',
    ),
  },
  confirm_button: {
    text: _('Lagre valg', 'Save selection'),
    a11yhint: _(
      'Aktiver for å lagre valgte favorittavganger',
      'Activate to save the selected favourite departures',
    ),
  },
};

export default SelectFavouriteDeparturesText;
