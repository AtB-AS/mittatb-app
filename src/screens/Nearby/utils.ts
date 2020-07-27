import {
  DeparturesWithStop,
  EstimatedCall,
  DeparturesRealtimeData,
  DepartureRealtimeData,
  QuayWithDepartures,
} from '../../sdk';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';

export function updateStopsWithRealtime(
  stops: DeparturesWithStopLocal[],
  realtime: DeparturesRealtimeData,
): DeparturesWithStopLocal[] {
  return stops.map(function (stop) {
    let newQuays: typeof stop.quays = {};
    for (let [quayId, quay] of Object.entries(stop.quays)) {
      const realtimeForQuay = realtime[quayId];
      if (!realtimeForQuay) {
        newQuays[quayId] = quay;
      } else {
        newQuays[quayId] = {
          ...quay,
          departures: updateDeparturesWithRealtime(
            quay.departures,
            realtimeForQuay,
          ),
        };
      }
    }
    return {
      ...stop,
      quays: newQuays,
    };
  });
}

function updateDeparturesWithRealtime(
  departures: EstimatedCall[],
  realtime?: DepartureRealtimeData,
): EstimatedCall[] {
  if (!realtime) return departures;

  return departures.map(function (departure) {
    const serviceJourneyId = departure.serviceJourney.id;
    const departureRealtime = realtime.departures[serviceJourneyId];

    if (!departureRealtime) {
      return departure;
    }

    return {
      ...departure,
      ...departureRealtime.timeData,
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
