import {
  EstimatedCall,
  Place as StopPlace,
  Quay,
} from '@atb/api/types/departures';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect, useState} from 'react';
import EstimatedCallItem from './EstimatedCallItem';
import {ExpandableList} from '@atb/components/expandable-list/ExpandableList';
import {getDeparturesForQuay} from '@atb/screens/Departures/utils';

type QuaySectionProps = {
  quay: Quay;
  departuresPerQuay?: number;
  data: EstimatedCall[] | null;
  testID?: 'quaySection' | string;
  navigateToQuay?: (arg0: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
  stopPlace: StopPlace;
  showOnlyFavorites: boolean;
};

export default function QuaySection({
  quay,
  departuresPerQuay,
  data,
  testID,
  navigateToQuay,
  navigateToDetails,
  stopPlace,
  showOnlyFavorites,
}: QuaySectionProps): JSX.Element {
  const {favoriteDepartures} = useFavorites();
  const [shouldForceExpandList, setShouldForceExpandList] =
    useState<boolean>(false);
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();

  useEffect(() => {
    if (showOnlyFavorites) {
      setShouldForceExpandList(
        !!favoriteDepartures.find((favorite) => quay.id === favorite.quayId),
      );
    } else {
      setShouldForceExpandList(false);
    }
  }, [showOnlyFavorites]);

  const header = quay.publicCode
    ? quay.name + ' ' + quay.publicCode
    : quay.name;

  const noDataText = showOnlyFavorites
    ? t(DeparturesTexts.noDeparturesForFavorites)
    : t(DeparturesTexts.noDepartures);

  return (
    <ExpandableList
      header={header}
      headerDesc={quay && quay.description}
      data={departures}
      testID={testID}
      dataLimit={departuresPerQuay}
      shouldForceExpandList={shouldForceExpandList}
      renderItem={(data: EstimatedCall, index: number) => (
        <EstimatedCallItem
          departure={data}
          testID={'departureItem' + index}
          quay={quay}
          stopPlace={stopPlace}
          navigateToDetails={navigateToDetails}
        />
      )}
      keyExtractor={(item: EstimatedCall) =>
        // ServiceJourney ID is not a unique key if a ServiceJourney
        // passes by the same stop several times, (e.g. Ringen in Oslo)
        // which is why it is used in combination with aimedDepartureTime.
        item.serviceJourney?.id + item.aimedDepartureTime
      }
      noDataText={noDataText}
      onShowMore={() => navigateToQuay && navigateToQuay(quay)}
    />
  );
}
