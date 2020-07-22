import {
  DeparturesWithStop,
  EstimatedCall,
  DeparturesRealtimeData,
  DepartureRealtimeData,
} from '../../sdk';

export function updateStopsWithRealtime(
  stops: DeparturesWithStop[],
  realtime: DeparturesRealtimeData,
): DeparturesWithStop[] {
  return stops.map(function (stop) {
    let newQuays: typeof stop.quays = {};
    for (let [quayId, quay] of Object.entries(stop.quays)) {
      newQuays[quayId] = {
        ...quay,
        departures: updateDeparturesWithRealtime(
          quay.departures,
          realtime[quayId],
        ),
      };
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
