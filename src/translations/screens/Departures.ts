import {translation as _} from '../commons';

const DeparturesTexts = {
  header: {
    title: _('Avganger', 'Departures', 'Avgangar'),
  },
  stopPlaceList: {
    stopPlace: _('Holdeplass', 'Stop', 'Haldeplass'),
    listDescription: {
      geoLoc: _('I nærheten', 'Nearby', 'I nærleiken'),
      address: _(`Holdeplasser nær `, `Stops near `, `Haldeplassar nær `),
    },
    a11yStopPlaceItemHint: _(
      'Aktiver for å se avganger',
      'Activate to view departures',
      'Aktiver for å sjå avgangar',
    ),
  },
  quayChips: {
    allStops: _('Alle stopp', 'All stops', 'Alle stopp'),
    a11yHint: _(
      'Aktiver for å vise avganger fra plattform ',
      'Activate to show departures from platform ',
      'Aktiver for å vise avgangar frå plattform ',
    ),
    a11yAllStopsHint: _(
      'Aktiver for å vise avganger fra alle plattformer',
      'Activate to show departures from all platforms',
      'Aktiver for å vise avgangar frå alle plattformer',
    ),
  },
  dateNavigation: {
    prevDay: _('Forrige dag', 'Previous day', 'Førre dag'),
    nextDay: _('Neste dag', 'Next day', 'Neste dag'),
    a11yNextDayHint: _(
      'Aktiver for å gå til neste dag',
      'Activate to go to next day',
      'Aktiver for å gå til neste dag',
    ),
    a11yPreviousDayHint: _(
      'Aktiver for å gå til forrige dag',
      'Activate to go to previous day',
      'Aktiver for å gå til førre dag',
    ),
    today: _('I dag', 'Today', 'I dag'),
    a11yDisabled: _('Deaktivert', 'Disabled', 'Deaktivert'),
    a11yChangeDateHint: _(
      'Aktiver for å forandre dato',
      'Activate to change date',
      'Aktiver for å endre dato',
    ),
    a11ySelectedLabel: (dateTime: string) =>
      _(
        `Valgt dato: ${dateTime}`,
        `Selected date, ${dateTime}`,
        `Vald dato: ${dateTime}`,
      ),
  },
  noDepartures: _(
    'Ingen avganger i dette tidsrommet.',
    'No departures in the selected period of time.',
    'Ingen avgangar i dette tidsrommet.',
  ),
  noDeparturesForFavorites: _(
    'Fant ingen avganger blant favorittene dine. Deaktiver "Vis kun favorittavganger" for å se alle avganger.',
    'We found no departures among your favourites. Disable "View favourite departures only" to show all departures.',
    'Fann ingen avgangar i favorittane dine. Deaktivér "Vis berre favorittavgangar" for å sjå alle avgangar.',
  ),
  quaySection: {
    a11yExpand: _(
      'Aktiver for å utvide',
      'Activate to expand',
      'Aktiver for å utvide',
    ),
    a11yMinimize: _(
      'Aktiver for å minimere',
      'Activate to minimize',
      'Aktiver for å minimere',
    ),
    a11yToQuayHint: _(
      'Aktiver for å vise flere avganger',
      'Activate to show more departures',
      'Aktiver for å vise fleire avgangar',
    ),
    moreDepartures: _(
      'Se flere avganger',
      'See more departures',
      'Sjå fleire avgangar',
    ),
  },
  line: _('Linje', 'Line', 'Linje'),
  a11yViewDepartureDetailsHint: _(
    'Aktiver for å se detaljer',
    'Activate to view details',
    'Aktiver for å sjå detaljar',
  ),
  favorites: {
    toggle: _(
      'Vis kun favorittavganger',
      'View favourite departures only',
      'Vis berre favorittavgangar',
    ),
  },
  widget: {
    heading: _('Favorittavganger', 'Favourite departures', 'Favorittavgangar'),
  },
  message: {
    noFavourites: _(
      'Det er ingen avganger som skal vises, da du ikke har noen stopp merket som favoritter.',
      'There are no departures to be shown, as you have no stops marked as favourites.',
      'Det er ingen avgangar som skal visast, då du ikkje har nokon haldeplassar markert som favorittar.',
    ),
    noFavouritesWidget: _(
      'Du har ingen favorittavganger. \nTrykk “Legg til favorittavgang” for å lagre en avgang du bruker ofte.',
      'You have no favorite departures. \nPress “Add favorite departure” to save a frequently used departure.',
      'Du har ingen favorittavgangar. \nTrykk "Legg til favorittavgang" for å lagre ein avgang du brukar ofte.',
    ),
    emptyResult: _(
      'Fant ingen avganger på valgt sted.',
      'No departures found at the specified location',
      'Fann ingen avgangar på valt stad.',
    ),
    resultFailed: _(
      'Kunne ikke laste avganger.',
      'Could not load the departures.',
      'Kunne ikkje laste avgangar.',
    ),
    resultNotFound: _(
      'Kunne ikke finne holdeplassen du leter etter.',
      'Could not find the stop place you are looking for.',
      'Kunne ikkje finne haldeplassen du leitar etter.',
    ),
    noData: _('Ingen informasjon', 'No data', 'Ingen informasjon'),
  },
  button: {
    text: _(
      'Velg favorittavganger',
      'Select favourite departures',
      'Vel favorittavgangar',
    ),
  },
  closeButton: {
    label: _('Lukk', 'Close', 'Lukk'),
  },
};
export default DeparturesTexts;
