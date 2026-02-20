import {EstimatedCall, Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React, {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {View, SectionList, SectionListData} from 'react-native';
import {useDepartures} from '@atb/screen-components/place-screen';
import {
  DeparturesTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {FavoriteLineSectionItem} from './FavoriteLineSectionItem';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import {getStopPlaceAndQuays} from '@atb/screen-components/place-screen';
import {StopPlaceAndQuay} from '@atb/screen-components/place-screen';
import {
  StoredFavoriteDeparture,
  useOnMarkFavouriteDepartures,
} from '@atb/modules/favorites';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {FavoriteDialogSheet} from '@atb/departure-list/section-items/FavoriteDialogSheet';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

type Props = {
  stopPlace: StopPlace;
  limitPerQuay: number;
  selectedQuay?: Quay;
  testID?: string;
  addedFavoritesVisibleOnDashboard?: boolean;
  onNavigateToQuay: (quay: Quay) => void;
  onComplete: () => void;
};

export const FavoriteLineList = ({
  stopPlace,
  selectedQuay,
  limitPerQuay,
  addedFavoritesVisibleOnDashboard,
  testID,
  onNavigateToQuay,
  onComplete,
}: Props) => {
  const stopPlaceAndQuays: StopPlaceAndQuay[] = useMemo(
    () =>
      getStopPlaceAndQuays(
        selectedQuay
          ? [
              {
                ...stopPlace,
                quays: stopPlace.quays?.filter(
                  (q) => q.id === selectedQuay?.id,
                ),
              },
            ]
          : [stopPlace],
      ),
    [stopPlace, selectedQuay],
  );
  const quays: Quay[] = useMemo(
    () => stopPlaceAndQuays.map(({quay}) => quay),
    [stopPlaceAndQuays],
  );

  const quayListData: SectionListData<StopPlaceAndQuay>[] =
    stopPlaceAndQuays.length ? [{data: stopPlaceAndQuays}] : [];

  const quayIds = quays.map((q) => q.id);
  const isFocusedAndActive = useIsFocusedAndActive();

  const {departures, departuresIsLoading, departuresIsError} = useDepartures({
    enabled: isFocusedAndActive,
    quayIds,
    // Upper limit to the number of different lines to show per quay. Normally
    // there are a lot fewer.
    limitPerQuay: 100,
    showOnlyFavorites: false,
    mode: 'Favourite',
  });

  return (
    <SectionList
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.quay.id}
      renderItem={({item, index}) => (
        <QuayLineSection
          quay={item.quay}
          isLoading={departuresIsLoading}
          limitPerQuay={limitPerQuay}
          data={departures}
          didLoadingDataFail={departuresIsError}
          testID={'lineList' + index}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          onNavigateToQuay={onNavigateToQuay}
          onComplete={onComplete}
        />
      )}
    />
  );
};

export type QuaySectionProps = {
  quay: Quay;
  data: EstimatedCall[] | null;
  limitPerQuay: number;
  isLoading: boolean;
  didLoadingDataFail: boolean;
  testID?: 'quaySection' | string;
  addedFavoritesVisibleOnDashboard?: boolean;
  onNavigateToQuay: (quay: Quay) => void;
  onComplete: () => void;
};

export function QuayLineSection({
  quay,
  data,
  limitPerQuay,
  isLoading,
  didLoadingDataFail,
  testID,
  addedFavoritesVisibleOnDashboard,
  onNavigateToQuay,
  onComplete,
}: QuaySectionProps): React.JSX.Element {
  const styles = useStyles();
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const sortedDepartures = departures.sort((a, b) =>
    compareByLineNameAndDesc(t, a, b),
  );

  const [selectedDeparture, setSelectedDeparture] = useState<{
    departure: EstimatedCall;
    existingFavorite: StoredFavoriteDeparture | undefined;
    onCloseRef: RefObject<any>;
  } | null>(null);

  const {alert, addFavorite} = useOnMarkFavouriteDepartures({
    ...selectedDeparture?.departure.serviceJourney.line,
    quay,
    lineNumber: selectedDeparture?.departure.serviceJourney.line.publicCode,
    existing: selectedDeparture?.existingFavorite,
    addedFavoritesVisibleOnDashboard,
  });

  const shouldShowMoreItemsLink = sortedDepartures.length > limitPerQuay;

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

  return (
    <View testID={testID}>
      <Section style={styles.section}>
        <GenericSectionItem>
          <View style={styles.stopPlaceHeader}>
            <View style={styles.stopPlaceHeaderText}>
              <ThemeText
                typography="body__s__strong"
                color="secondary"
                style={styles.rightMargin}
                testID={testID + 'Name'}
              >
                {quay.publicCode
                  ? quay.name + ' ' + quay.publicCode
                  : quay.name}
              </ThemeText>
              {!!quay.description && (
                <ThemeText
                  style={styles.rightMargin}
                  typography="body__s"
                  color="secondary"
                  testID={testID + 'Description'}
                >
                  {quay.description}
                </ThemeText>
              )}
            </View>
          </View>
        </GenericSectionItem>
        {sortedDepartures.length === 0 && !isLoading && !didLoadingDataFail && (
          <GenericSectionItem>
            <ThemeText
              color="secondary"
              typography="body__s"
              style={{textAlign: 'center', width: '100%'}}
            >
              {t(DeparturesTexts.noDepartures)}
            </ThemeText>
          </GenericSectionItem>
        )}
        {sortedDepartures.slice(0, limitPerQuay).map((departure) => (
          <FavoriteLineSectionItem
            key={departure.serviceJourney.id}
            quay={quay}
            departure={departure}
            onPressFavorite={(departure, existingFavorite, onCloseRef) => {
              setSelectedDeparture({
                departure,
                existingFavorite,
                onCloseRef,
              });
            }}
          />
        ))}
        {didLoadingDataFail && !isLoading && (
          <GenericSectionItem>
            <View style={styles.messageBox}>
              <ThemeText typography="body__s" color="secondary">
                {t(DeparturesTexts.message.noData)}
              </ThemeText>
            </View>
          </GenericSectionItem>
        )}
        {isLoading && (
          <GenericSectionItem>
            <View style={{width: '100%'}}>
              <View />
            </View>
          </GenericSectionItem>
        )}
        {shouldShowMoreItemsLink && (
          <LinkSectionItem
            text={t(DeparturesTexts.quaySection.moreDepartures)}
            textType="body__m__strong"
            onPress={() => onNavigateToQuay(quay)}
            accessibility={{
              accessibilityHint: t(DeparturesTexts.quaySection.a11yToQuayHint),
            }}
            testID={testID + 'More'}
          />
        )}
      </Section>
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
            addFavorite={(forSpecificLineName: boolean) => {
              addFavorite(
                {
                  ...selectedDeparture.departure.serviceJourney.line,
                  lineNumber:
                    selectedDeparture.departure.serviceJourney.line.publicCode,
                  destinationDisplay:
                    selectedDeparture.departure.destinationDisplay,
                },
                forSpecificLineName,
              );
              onComplete();
            }}
            bottomSheetModalRef={bottomSheetModalRef}
            onCloseFocusRef={selectedDeparture.onCloseRef}
          />
        )}
    </View>
  );
}

function getDeparturesForQuay(
  departures: EstimatedCall[] | null,
  quay: Quay,
): EstimatedCall[] {
  if (!departures) return [];
  return departures.filter(
    (departure) => departure && departure.quay?.id === quay.id,
  );
}

function compareByLineNameAndDesc(
  t: TranslateFunction,
  d1: EstimatedCall,
  d2: EstimatedCall,
): number {
  const lineNumber1 = d1.serviceJourney?.line.publicCode;
  const lineNumber2 = d2.serviceJourney?.line.publicCode;
  const lineDesc1 = formatDestinationDisplay(t, d1?.destinationDisplay);
  const lineDesc2 = formatDestinationDisplay(t, d2?.destinationDisplay);

  if (!lineNumber1) return 1;
  if (!lineNumber2) return -1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(lineNumber1) && parseInt(lineNumber2)) {
    //if both line numbers are same, compare by front text i.e. line description
    if (parseInt(lineNumber1) === parseInt(lineNumber2)) {
      if (!lineDesc1) return 1;
      if (!lineDesc2) return -1;
      return lineDesc1.localeCompare(lineDesc2);
    }
    return parseInt(lineNumber1) - parseInt(lineNumber2);
  }
  // Otherwise compare as strings
  return lineNumber1.localeCompare(lineNumber2);
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginHorizontal: theme.spacing.medium,
    marginVertical: theme.spacing.medium,
  },
  stopPlaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopPlaceHeaderText: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  rightMargin: {
    marginRight: theme.spacing.medium,
  },
  messageBox: {
    width: '100%',
    alignItems: 'center',
  },
}));
