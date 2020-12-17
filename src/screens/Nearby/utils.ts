import {DepartureGroupMetadata} from '../../api/departures/departure-group';
import {
  DepartureGroup,
  DepartureTime,
  QuayGroup,
  StopPlaceGroup,
} from '../../api/departures/types';
import {DepartureRealtimeData, DeparturesRealtimeData} from '../../sdk';
import {isNumberOfMinutesInThePast} from '../../utils/date';

export const HIDE_AFTER_NUM_MINUTES = 1;

/***
 * Used to update all stops with new time from realtime mapping object returned
 * from the BFF. It also removes outdated departures which most likely have passed.
 */
export function updateStopsWithRealtime(
  stops: DepartureGroupMetadata['data'],
  realtime: DeparturesRealtimeData,
): DepartureGroupMetadata['data'] {
  return stops.map<StopPlaceGroup>(function (stop) {
    let quays = stop.quays.map(function (quayGroup) {
      const quayId = quayGroup.quay.id;
      const realtimeForQuay = realtime[quayId];
      const newQuayGroup = filterOutOutdatedDepartures(quayGroup);

      if (!realtimeForQuay) {
        return newQuayGroup;
      }

      return {
        quay: newQuayGroup.quay,
        group: updateDeparturesWithRealtime(
          newQuayGroup.group,
          realtimeForQuay,
        ),
      };
    });

    return {
      stopPlace: stop.stopPlace,
      quays,
    };
  });
}

function filterOutOutdatedDepartures(quayGroup: QuayGroup) {
  const newDepartureGroups = quayGroup.group.map(function (group) {
    const newDepartures = group.departures.filter(isValidDeparture);
    // Optimization to avoid having to sort list to often.
    // If after filtering it has the same length it means we could
    // just use the previous departure list.
    if (newDepartures.length === group.departures.length) {
      return group;
    }

    return {
      lineInfo: group.lineInfo,
      departures: newDepartures,
    };
  });

  return {
    quay: quayGroup.quay,
    group: newDepartureGroups,
  };
}

function updateDeparturesWithRealtime(
  departureGroups: DepartureGroup[],
  realtime?: DepartureRealtimeData,
): DepartureGroup[] {
  if (!realtime) return departureGroups;

  return departureGroups.map(function (group) {
    const departures = group.departures.map(function (departure) {
      const serviceJourneyId = departure.serviceJourneyId;

      if (!serviceJourneyId) {
        return departure;
      }

      const departureRealtime = realtime.departures[serviceJourneyId];

      if (!departureRealtime) {
        return departure;
      }

      return {
        ...departure,
        time: departureRealtime.timeData.expectedDepartureTime,
        realtime: departureRealtime.timeData.realtime,
      };
    });

    return {
      lineInfo: group.lineInfo,
      departures,
    };
  });
}
export function hasNoQuaysWithDepartures(departures: StopPlaceGroup[] | null) {
  return (
    departures !== null &&
    (departures.length === 0 ||
      departures.every((deps) => hasNoGroupsWithDepartures(deps.quays)))
  );
}
export function hasNoGroupsWithDepartures(departures: QuayGroup[]) {
  return departures.every((q) => q.group.every(hasNoDeparturesOnGroup));
}
export function hasNoDeparturesOnGroup(group: DepartureGroup) {
  return (
    group.departures.length === 0 ||
    group.departures.every((d) => !isValidDeparture(d))
  );
}

export function isValidDeparture(departure: DepartureTime) {
  return !isNumberOfMinutesInThePast(departure.time, HIDE_AFTER_NUM_MINUTES);
}
