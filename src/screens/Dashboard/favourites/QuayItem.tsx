import {
  EstimatedCall,
  Place as StopPlace,
  Quay,
} from '@atb/api/types/departures';
import React from 'react';
import EstimatedCallItem from '@atb/screens/Dashboard/favourites/EstimatedCallItem';
import {ExpandableList} from '@atb/components/expandable-list/ExpandableList';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {getDeparturesForQuay} from '@atb/screens/Departures/utils';

type QuaySectionProps = {
  quay: Quay;
  departuresPerQuay?: number;
  data: EstimatedCall[] | null;
  navigateToQuay?: (arg0: Quay) => void;
  stopPlace: StopPlace;
};

export default function QuayItem({
  quay,
  departuresPerQuay,
  data,
  stopPlace,
  navigateToQuay,
}: QuaySectionProps): JSX.Element {
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();
  const header = quay.publicCode
    ? quay.name + ' ' + quay.publicCode
    : quay.name;

  return (
    <ExpandableList
      header={header}
      headerDesc={quay && quay.description}
      data={departures}
      dataLimit={departuresPerQuay}
      renderItem={(data: EstimatedCall, index: number) => (
        <EstimatedCallItem
          departure={data}
          testID={'departureItem' + index}
          quay={quay}
          stopPlace={stopPlace}
        />
      )}
      keyExtractor={(item: EstimatedCall) =>
        // ServiceJourney ID is not a unique key if a ServiceJourney
        // passes by the same stop several times, (e.g. Ringen in Oslo)
        // which is why it is used in combination with aimedDepartureTime.
        item.serviceJourney?.id + item.aimedDepartureTime
      }
      noDataText={t(DeparturesTexts.noDepartures)}
      onShowMore={() => navigateToQuay && navigateToQuay(quay)}
    />
  );
}
