import {GenericSectionItem, SectionSeparator} from '@atb/components/sections';
import {EstimatedCall} from '@atb/api/types/departures';
import {ThemeText} from '@atb/components/text';
import {FlatList} from 'react-native-gesture-handler';
import React, {useCallback} from 'react';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {
  EstimatedCallItem,
  EstimatedCallItemProps,
} from '@atb/place-screen/components/EstimatedCallItem';
import {
  StoredFavoriteDeparture,
  useOnMarkFavouriteDepartures,
} from '@atb/favorites';
import {QuaySectionProps} from '@atb/place-screen/components/QuaySection';
import {secondsBetween} from '@atb/utils/date';

type EstimatedCallRenderItem = {
  item: EstimatedCallItemProps;
  index: number;
};

type Props = Pick<
  QuaySectionProps,
  | 'quay'
  | 'stopPlace'
  | 'addedFavoritesVisibleOnDashboard'
  | 'navigateToDetails'
  | 'mode'
  | 'showOnlyFavorites'
> & {
  departures: EstimatedCall[];
  shouldShowMoreItemsLink: boolean;
  noDeparturesToShow: boolean;
};
export const EstimatedCallList = ({
  quay,
  stopPlace,
  departures,
  addedFavoritesVisibleOnDashboard,
  navigateToDetails,
  mode,
  showOnlyFavorites,
  shouldShowMoreItemsLink,
  noDeparturesToShow,
}: Props) => {
  const {t} = useTranslation();
  const {onMarkFavourite, getExistingFavorite} = useOnMarkFavouriteDepartures(
    quay,
    stopPlace,
    addedFavoritesVisibleOnDashboard,
  );

  const onPressFavorite = useCallback(
    (departure: EstimatedCall, existingFavorite?: StoredFavoriteDeparture) =>
      onMarkFavourite(
        {
          ...departure.serviceJourney.line,
          lineNumber: departure.serviceJourney.line.publicCode,
          destinationDisplay: departure.destinationDisplay,
        },
        existingFavorite,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onPressDetails = useCallback((departure: EstimatedCall) => {
    navigateToDetails?.(
      departure.serviceJourney.id,
      departure.date,
      departure.aimedDepartureTime,
      departure.quay.id,
      departure.cancellation,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listData: EstimatedCallItemProps[] = departures.map(
    (departure, index) => {
      const existingFavorite = getExistingFavorite({
        ...departure.serviceJourney.line,
        lineNumber: departure.serviceJourney.line.publicCode,
        destinationDisplay: departure.destinationDisplay,
      });

      return {
        secondsUntilDeparture: secondsBetween(
          new Date(),
          departure.expectedDepartureTime,
        ),
        departure,
        mode,
        existingFavorite,
        onPressDetails: onPressDetails,
        onPressFavorite: onPressFavorite,
        showBottomBorder:
          index === departures.length - 1 && !shouldShowMoreItemsLink,
      };
    },
  );

  const renderItem = useCallback(
    ({item}: EstimatedCallRenderItem) => <EstimatedCallItem {...item} />,
    [],
  );

  const keyExtractor = useCallback(
    ({departure}: EstimatedCallItemProps) =>
      // ServiceJourney ID is not a unique key if a ServiceJourney
      // passes by the same stop several times, (e.g. Ringen in Oslo)
      // which is why it is used in combination with aimedDepartureTime.
      departure.serviceJourney.id + departure.aimedDepartureTime,
    [],
  );

  return (
    <FlatList
      ItemSeparatorComponent={SectionSeparator}
      data={listData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      windowSize={5}
      ListEmptyComponent={
        <>
          {noDeparturesToShow && (
            <GenericSectionItem
              radius={!shouldShowMoreItemsLink ? 'bottom' : undefined}
            >
              <ThemeText
                color="secondary"
                type="body__secondary"
                style={{textAlign: 'center', width: '100%'}}
              >
                {showOnlyFavorites
                  ? t(DeparturesTexts.noDeparturesForFavorites)
                  : t(DeparturesTexts.noDepartures)}
              </ThemeText>
            </GenericSectionItem>
          )}
        </>
      }
    />
  );
};
