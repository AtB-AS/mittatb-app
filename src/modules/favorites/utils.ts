import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  StoredFavoriteDeparture,
  UserFavoriteDepartures,
  UserFavoriteDeparturesLegacy,
} from './types';
import {uniqBy} from 'lodash';
import {
  DepartureLineInfo,
  EstimatedCallWithLineName,
} from '@atb/api/departures/types';

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

export type ItemWithDestinationDisplayMigrationPairType =
  | DepartureLineInfo
  | EstimatedCallWithLineName;

export function getUniqueDestinationDisplayMigrationPairs(
  itemsWithDestinationDisplayMigrationPair?: ItemWithDestinationDisplayMigrationPairType[],
) {
  const destinationDisplayMigrationPairs =
    itemsWithDestinationDisplayMigrationPair?.map((iwddmp) => ({
      lineName: iwddmp?.lineName,
      destinationDisplay: iwddmp?.destinationDisplay,
    }));
  return uniqBy(
    destinationDisplayMigrationPairs,
    (destinationDisplayMigrationPair) =>
      destinationDisplayMigrationPair?.lineName,
  );
}

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
  destinationDisplayMigrationPairs: DestinationDisplayMigrationPair[],
): {
  upToDateFavoriteDepartures: StoredFavoriteDeparture[];
  aFavoriteDepartureWasUpdated: boolean;
} => {
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
