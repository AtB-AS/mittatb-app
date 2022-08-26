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
      'Vi fant ingen favoritter. For å vise dine favoritter må du aktivere ny avganger-visning, og klikke på stjernen ved en eller flere avganger.',
      'We found no favourites.',
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
