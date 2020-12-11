import {DepartureGroupMetadata} from '../../api/departures/departure-group';
import {DepartureGroup, StopPlaceGroup} from '../../api/departures/types';
import {
  DepartureRealtimeData,
  DeparturesRealtimeData,
  DeparturesWithStop,
  QuayWithDepartures,
} from '../../sdk';

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

export type QuayWithDeparturesAndLimits = QuayWithDepartures & {
  showLimit: number;
};
export type DeparturesWithStopLocal = DeparturesWithStop & {
  quays: {
    [quayId: string]: QuayWithDeparturesAndLimits;
  };
};

export function mapQuayDeparturesToShowlimits(
  stops: DeparturesWithStop[],
  showLimit: number,
): DeparturesWithStopLocal[] {
  return stops.map(function (stop) {
    let newQuays: DeparturesWithStopLocal['quays'] = {};

    for (let [quayId, quay] of Object.entries(stop.quays)) {
      newQuays[quayId] = {
        ...quay,
        showLimit,
      };
    }

    return {
      ...stop,
      quays: newQuays,
    };
  });
}

export function showMoreItemsOnQuay(
  stops: DeparturesWithStopLocal[],
  quayIdToUpdate: string,
  additionalItemsToShow: number,
): DeparturesWithStopLocal[] {
  return stops.map(function (stop) {
    let newQuays: DeparturesWithStopLocal['quays'] = {};

    for (let [quayId, quay] of Object.entries(stop.quays)) {
      if (quayId !== quayIdToUpdate) {
        newQuays[quayId] = quay;
      } else {
        newQuays[quayId] = {
          ...quay,
          showLimit: quay.showLimit + additionalItemsToShow,
        };
      }
    }

    return {
      ...stop,
      quays: newQuays,
    };
  });
}
