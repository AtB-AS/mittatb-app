import {EstimatedCall} from '@atb/api/types/departures';
import {GenericSectionItem, SectionSeparator} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {FlatList} from 'react-native-gesture-handler';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {EstimatedCallItem, EstimatedCallItemProps} from './EstimatedCallItem';
import {
  StoredFavoriteDeparture,
  useFavoritesContext,
  useOnMarkFavouriteDepartures,
} from '@atb/modules/favorites';
import {QuaySectionProps} from './QuaySection';
import {secondsBetween} from '@atb/utils/date';
import {useNow} from '@atb/utils/use-now';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {FavoriteDialogSheet} from '@atb/departure-list/section-items/FavoriteDialogSheet';

type EstimatedCallRenderItem = {
  item: EstimatedCallItemProps;
  index: number;
};

type Props = Pick<
  QuaySectionProps,
  | 'quay'
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
  departures,
  addedFavoritesVisibleOnDashboard,
  navigateToDetails,
  mode,
  showOnlyFavorites,
  shouldShowMoreItemsLink,
  noDeparturesToShow,
}: Props) => {
  const {t} = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<{
    departure: EstimatedCall;
    existingFavorite: StoredFavoriteDeparture | undefined;
    onCloseRef: RefObject<any>;
  } | null>(null);

  const now = useNow(5 * ONE_SECOND_MS);

  const {alert, addFavorite} = useOnMarkFavouriteDepartures({
    ...selectedDeparture?.departure.serviceJourney.line,
    quay,
    lineNumber: selectedDeparture?.departure.serviceJourney.line.publicCode,
    existing: selectedDeparture?.existingFavorite,
    addedFavoritesVisibleOnDashboard,
  });

  useEffect(() => {
    if (selectedDeparture) {
      if (
        selectedDeparture.existingFavorite &&
        selectedDeparture?.departure.serviceJourney.line.publicCode
      ) {
        alert();
        setSelectedDeparture(null);
      } else if (
        selectedDeparture.departure.destinationDisplay &&
        selectedDeparture.departure.serviceJourney.line.publicCode &&
        quay.name
      ) {
        bottomSheetModalRef.current?.present();
      }
    }
  }, [alert, quay.name, selectedDeparture]);

  const {getFavoriteDeparture} = useFavoritesContext();

  const onPressFavorite = useCallback(
    (
      departure: EstimatedCall,
      existingFavorite: StoredFavoriteDeparture | undefined,
      onCloseRef: RefObject<any>,
    ) => {
      setSelectedDeparture({
        departure,
        existingFavorite,
        onCloseRef,
      });
    },
    [],
  );

  const onPressDetails = useCallback(
    (departure: EstimatedCall) => {
      navigateToDetails?.(
        departure.serviceJourney.id,
        departure.date,
        departure.aimedDepartureTime,
        departure.stopPositionInPattern,
        departure.cancellation,
      );
    },
    [navigateToDetails],
  );

  const listData: EstimatedCallItemProps[] = departures.map(
    (departure, index) => {
      const existingFavorite = getFavoriteDeparture({
        quayId: quay.id,
        lineId: departure.serviceJourney.line.id,
        destinationDisplay: departure.destinationDisplay,
      });

      return {
        secondsUntilDeparture: secondsBetween(
          new Date(now),
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
      // ServiceJourney ID is not a unique key if a ServiceJourney passes by the
      // same stop several times, (e.g. Ringen in Oslo) which is why it is used
      // in combination with stopPositionInPattern.
      departure.serviceJourney.id + departure.stopPositionInPattern,
    [],
  );

  return (
    <>
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
                  typography="body__s"
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

      {selectedDeparture?.departure.destinationDisplay &&
        selectedDeparture?.departure.serviceJourney.line.publicCode &&
        quay.name && (
          <FavoriteDialogSheet
            onCloseCallback={() => setSelectedDeparture(null)}
            quayName={quay.name}
            destinationDisplay={selectedDeparture?.departure.destinationDisplay}
            lineNumber={
              selectedDeparture?.departure.serviceJourney.line.publicCode
            }
            addFavorite={(forSpecificLineName: boolean) =>
              addFavorite(
                {
                  ...selectedDeparture.departure.serviceJourney.line,
                  lineNumber:
                    selectedDeparture.departure.serviceJourney.line.publicCode,
                  destinationDisplay:
                    selectedDeparture.departure.destinationDisplay,
                },
                forSpecificLineName,
              )
            }
            bottomSheetModalRef={bottomSheetModalRef}
            onCloseFocusRef={selectedDeparture.onCloseRef}
          />
        )}
    </>
  );
};
