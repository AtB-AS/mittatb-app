import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';

import {UserFavoriteDepartures, UserFavoriteDeparturesLegacy} from './types';
import {StoredFavoriteDeparture} from '@atb/favorites';
import {StopPlaceGroup} from '@atb/api/departures/types';
import {flatten, uniqBy} from 'lodash';

function mapLegacyLineNameToDestinationDisplay(
  legacyLineName: string | undefined,
): DestinationDisplay | undefined {
  if (legacyLineName === undefined) {
    return undefined;
  }
  return {
    frontText: legacyLineName,
    via: undefined,
  };
}

export function getFavoriteDeparturesWithDestinationDisplay(
  favoriteDepartures: UserFavoriteDepartures | UserFavoriteDeparturesLegacy,
) {
  // app version 1.41 and earlier used lineName in favoriteDepartures
  // this function ensures all favoriteDepartures are migrated to using destinationDisplay instead
  let didMigrateFavoriteDeparture = false;
  const favoriteDeparturesWithDestinationDisplay = favoriteDepartures.map(
    (fd) => {
      if ('lineName' in fd) {
        didMigrateFavoriteDeparture = true;
        const {lineName, ...fdWithoutLineName} = fd;
        return {
          ...fdWithoutLineName,
          destinationDisplay: mapLegacyLineNameToDestinationDisplay(lineName),
        };
      } else {
        return fd;
      }
    },
  );
  return {
    favoriteDeparturesWithDestinationDisplay,
    didMigrateFavoriteDeparture,
  };
}

export type DestinationDisplayMigrationPair = {
  lineName?: string;
  destinationDisplay?: DestinationDisplay;
};

const getUniqueDestinationDisplayMigrationPairs = (
  stopPlaceGroups: StopPlaceGroup[],
): DestinationDisplayMigrationPair[] => {
  const nestedDestinationDisplayMigrationPairs = stopPlaceGroups.map(
    (stopPlaceGroup) =>
      stopPlaceGroup?.quays.map((quay) =>
        quay.group.map((groupItem) => ({
          lineName: groupItem?.lineInfo?.lineName,
          destinationDisplay: groupItem?.lineInfo?.destinationDisplay,
        })),
      ),
  );
  // flatten 3d array to 1d and ensure unique migration pairs
  return uniqBy(
    flatten(flatten(nestedDestinationDisplayMigrationPairs)),
    (pair) => pair.lineName,
  );
};

export const shouldDestinationDisplayBeMigrated = (
  destinationDisplay: DestinationDisplay | undefined,
  destinationDisplayMigrationPair: DestinationDisplayMigrationPair,
): boolean => {
  const {
    lineName: migrationLineName,
    destinationDisplay: migrationDestinationDisplay,
  } = destinationDisplayMigrationPair;

  const frontTextEqualsMigrationLineName =
    destinationDisplay?.frontText === migrationLineName;
  const frontTextIncludesViaString =
    !!destinationDisplay?.frontText?.includes(' via ');
  const viaIsEmpty = (destinationDisplay?.via?.length || 0) === 0;
  const migrationViaIsNotEmpty =
    (migrationDestinationDisplay?.via?.length || 0) > 0;
  return (
    frontTextEqualsMigrationLineName &&
    frontTextIncludesViaString &&
    viaIsEmpty &&
    migrationViaIsNotEmpty
  );
};

export const getUpToDateFavoriteDepartures = (
  storedFavoriteDepartures: StoredFavoriteDeparture[],
  stopPlaceGroups: StopPlaceGroup[],
): {
  upToDateFavoriteDepartures: StoredFavoriteDeparture[];
  aFavoriteDepartureWasUpdated: boolean;
} => {
  const destinationDisplayMigrationPairs =
    getUniqueDestinationDisplayMigrationPairs(stopPlaceGroups);

  let aFavoriteDepartureWasUpdated = false;
  const upToDateFavoriteDepartures = storedFavoriteDepartures.map(
    (storedFavoriteDeparture) => {
      const upToDateFavoriteDeparture = storedFavoriteDeparture;
      for (const destinationDisplayMigrationPair of destinationDisplayMigrationPairs) {
        if (
          shouldDestinationDisplayBeMigrated(
            storedFavoriteDeparture?.destinationDisplay,
            destinationDisplayMigrationPair,
          )
        ) {
          upToDateFavoriteDeparture.destinationDisplay =
            destinationDisplayMigrationPair.destinationDisplay;
          aFavoriteDepartureWasUpdated = true;
          break;
        }
      }
      return upToDateFavoriteDeparture;
    },
  );
  return {
    upToDateFavoriteDepartures,
    aFavoriteDepartureWasUpdated,
  };
};
