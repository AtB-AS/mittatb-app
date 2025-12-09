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
    options: {
      now: _('Nå', 'Leave now', 'Nå'),
      departure: _('Velg tid', 'Leave at', 'Velg tid'),
    },
    departureNow: _(`Avreise nå`, `Leave now`, `Avreise no`),
    departureLater: (time: string) =>
      _(`Avreise ${time}`, `Leave at ${time}`, `Avreise ${time}`),
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
  a11yViewDepartureDetailsHint: _(
    'Aktiver for å se detaljer',
    'Activate to view details',
    'Aktiver for å sjå detaljar',
  ),
  a11yMarkFavouriteHint: _(
    'Aktiver for å merke som favoritt',
    'Activate to mark as favourite',
    'Aktiver for å merke som favoritt',
  ),
  favorites: {
    favoriteButton: {
      allVariations: _(
        'Alle variasjoner av linjen er favoritt',
        'All variations of the line are favourite',
        'Alle variasjoner av linjen er favoritt',
      ),

      oneVariation: _(
        'Denne variasjonen av linjen er favoritt',
        'This variaton of the line is a favourite',
        'Denne variasjonen av linjen er en favoritt',
      ),
    },
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
      'Du har ingen favorittavganger.',
      'You have no favourite departures.',
      'Du har ingen favorittavgangar.',
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
  results: {
    lines: {
      lineNameAccessibilityHint: _(
        'Aktiver for detaljer om avgang og oversikt over kommende avganger.',
        'Activate for departure details, and to review future departures',
        'Trykk for detaljar om avgang og oversikt over komande avgangar',
      ),
      favorite: {
        addFavorite: (name: string, place: string) =>
          _(
            `Legg til favorittavgang: ${name} frå ${place}`,
            `Add favourite departure: ${name} from ${place}.`,
            `Legg til favorittavgang: ${name} frå ${place}`,
          ),
        removeFavorite: (name: string, place: string) =>
          _(
            `Fjern favorittavgang: ${name} frå ${place}`,
            `Delete favourite departure: ${name} from ${place}.`,
            `Fjern favorittavgang: ${name} frå ${place}`,
          ),
        delete: {
          label: _(
            'Fjerne favorittavgang?',
            'Delete favourite departure?',
            'Slette favorittavgang?',
          ),
          confirmWarning: (
            lineNumber: string,
            lineName: string,
            quayName: string,
          ) =>
            _(
              `Sikker på at du vil fjerne linje ${lineNumber} ${lineName} fra ${quayName} som favorittavgang?`,
              `Sure you want to delete line ${lineNumber} ${lineName} from ${quayName} as a favourite?`,
              `Er du sikker på at du vil fjerne linje ${lineNumber} ${lineName} fra ${quayName} som favorittavgang?`,
            ),
          cancel: _('Avbryt', 'Cancel', 'Avbryt'),
          delete: _('Slett', 'Delete', 'Slett'),
        },
        message: {
          saved: _(`Lagt til.`, 'Added', `Lagt til.`),
          removed: _(`Fjernet.`, 'Removed', `Fjerna.`),
        },
      },
    },
    messages: {
      initial: _(
        'Søk etter avganger fra holdeplasser eller i nærheten av steder.',
        'Search for departures from nearby stops or locations',
        'Søk etter avgangar frå haldeplassar eller i nærleiken av stadar.',
      ),
      emptyResultFavorites: _(
        'Fant ingen favorittavganger på valgt plass.',
        'No favourite departures found at the specified location',
        'Ingen favorittavgangar funne på valt stad.',
      ),
    },
    relativeTime: (time: string) => _(`om ${time}`, `in ${time}`, `om ${time}`),

    quayResult: {
      platformHeader: {
        accessibilityLabel: (name: string, publicCode: string) =>
          _(
            `Avganger fra plattform ${name} ${publicCode}.`,
            `Departures from platform ${name} ${publicCode}.`,
            `Avgangar frå plattform ${name} ${publicCode}.`,
          ),
        accessibilityLabelNoPublicCode: (name: string) =>
          _(
            `Avganger fra plattform på holdeplassen ${name}.`,
            `Departures from stop place platform ${name}.`,
            `Avgangar frå plattform på haldeplassen ${name}.`,
          ),
        distance: {
          label: (distance: string) =>
            _(
              `Det er rundt ${distance} til plattform.`,
              `About ${distance} to platform.`,
              `Det er omtrent ${distance} til plattformen.`,
            ),
        },
      },
      showMoreToggler: {
        text: _(
          'Vis flere avganger',
          'Show more departures',
          'Vis fleire avgangar',
        ),
      },
    },
    departure: {
      hasPassedAccessibilityLabel: (time: string) =>
        _(
          `Avgangen ${time} har trolig passert plattformen.`,
          `Departure ${time} has likely left the platform.`,
          `Avgangen ${time} har truleg passert plattformen.`,
        ),
      upcomingRealtimeAccessibilityLabel: (time: string) =>
        _(
          `Kommende avgang sanntid ${time} `,
          `Next departure realtime ${time} `,
          `Neste avgang sanntid ${time}`,
        ),
      upcomingAccessibilityLabel: (time: string) =>
        _(
          `Kommende avgang ${time} `,
          `Next departure ${time} `,
          `Neste avgang ${time}`,
        ),
      nextAccessibilityLabel: (time: string) =>
        _(
          `Neste avganger: ${time} `,
          `Next departures: ${time} `,
          `Neste avgangar: ${time}`,
        ),
      nextAccessibilityRealtime: (time: string) =>
        _(`sanntid ${time}`, `realtime: ${time}`, `Sanntid: ${time}`),
    },
  },

  favoriteDialogSheet: {
    title: _(
      'Velg favorittavgang',
      'Select favourite departure',
      'Vel favorittavgang',
    ),
    description: (lineNumber: string, quayName: string) =>
      _(
        `Hvilken variasjon av linje ${lineNumber} fra ${quayName} ønsker du å sette som favoritt?`,
        `Which variation of line ${lineNumber} from ${quayName} do you want to mark as a favourite?`,
        `Korleis variasjon av linje ${lineNumber} frå ${quayName} ønsker du å sette som favoritt?`,
      ),
    buttons: {
      specificServiceJourney: _(
        `Kun akkurat denne avgangen`,
        `Only this departure`,
        `Berre denne avgangen`,
      ),
      specific: (lineNumber: string, lineName: string) =>
        _(
          `Kun '${lineNumber} ${lineName}'`,
          `Only '${lineNumber} ${lineName}'`,
          `Berre '${lineNumber} ${lineName}'`,
        ),
      all: (lineNumber: string) =>
        _(
          `Alle variasjoner av linje ${lineNumber}`,
          `All variations of line ${lineNumber}`,
          `Alle variasjonar av linje ${lineNumber}`,
        ),
    },
  },
};
export default DeparturesTexts;
