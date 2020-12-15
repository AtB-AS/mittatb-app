import {DepartureGroupMetadata} from '../../api/departures/departure-group';
import {
  DepartureGroup,
  QuayGroup,
  StopPlaceGroup,
} from '../../api/departures/types';
import {DepartureRealtimeData, DeparturesRealtimeData} from '../../sdk';
import {isNumberOfMinutesInThePast} from '../../utils/date';

export const HIDE_AFTER_NUM_MINUTES = 2;

export function updateStopsWithRealtime(
  stops: DepartureGroupMetadata['data'],
  realtime: DeparturesRealtimeData,
): DepartureGroupMetadata['data'] {
  return stops.map<StopPlaceGroup>(function (stop) {
    let quays = stop.quays.map(function (quayGroup) {
      const quayId = quayGroup.quay.id;
      const realtimeForQuay = realtime[quayId];
      if (!realtimeForQuay) {
        return quayGroup;
      }

      return {
        quay: quayGroup.quay,
        group: updateDeparturesWithRealtime(quayGroup.group, realtimeForQuay),
      };
    });

    return {
      stopPlace: stop.stopPlace,
      quays,
    };
  });
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
        aimedTime: departureRealtime.timeData.aimedDepartureTime,
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
    group.departures.every((d) =>
      isNumberOfMinutesInThePast(d.aimedTime, HIDE_AFTER_NUM_MINUTES),
    )
  );
}
