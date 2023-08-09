import {EstimatedCall, Quay, StopPlace} from '@atb/api/types/departures';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {
  GenericClickableSectionItem,
  GenericSectionItem,
  LinkSectionItem,
  Section,
  SectionSeparator,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {EstimatedCallItem} from './EstimatedCallItem';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {isSituationValidAtDate, SituationSectionItem} from '@atb/situations';

type QuaySectionProps = {
  quay: Quay;
  departuresPerQuay?: number;
  data: EstimatedCall[] | null;
  isLoading: boolean;
  didLoadingDataFail: boolean;
  testID?: 'quaySection' | string;
  navigateToQuay?: (arg0: Quay) => void;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
  stopPlace: StopPlace;
  showOnlyFavorites: boolean;
  allowFavouriteSelection: boolean;
  searchDate?: string | Date;
  addedFavoritesVisibleOnDashboard?: boolean;
  mode: StopPlacesMode;
};

type EstimatedCallWithData = {
  departure: EstimatedCall;
  quay: Quay;
  mode: StopPlacesMode;
  allowFavouriteSelection: boolean;
  stopPlace: StopPlace;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
  departuresPerQuay?: number;
  addedFavoritesVisibleOnDashboard?: boolean;
};

type EstimatedCallRenderItem = {
  item: EstimatedCallWithData;
  index: number;
};

export function QuaySection({
  quay,
  departuresPerQuay,
  data,
  isLoading,
  didLoadingDataFail,
  testID,
  navigateToQuay,
  navigateToDetails,
  stopPlace,
  showOnlyFavorites,
  allowFavouriteSelection,
  addedFavoritesVisibleOnDashboard,
  searchDate,
  mode,
}: QuaySectionProps): JSX.Element {
  const {favoriteDepartures} = useFavorites();
  const [isMinimized, setIsMinimized] = useState(false);
  const styles = useStyles();
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();

  const departuresToDisplay =
    mode === 'Favourite'
      ? departures.sort(compareByLineNameAndDesc)
      : departures;
  useEffect(() => {
    if (!showOnlyFavorites) return setIsMinimized(false);
    setIsMinimized(
      !!navigateToQuay &&
        !favoriteDepartures.find((favorite) => quay.id === favorite.quayId),
    );
  }, [showOnlyFavorites]);

  const hasMoreItemsThanDisplayLimit =
    departuresPerQuay && departuresToDisplay.length > departuresPerQuay;

  const shouldShowMoreItemsLink =
    navigateToQuay &&
    !isMinimized &&
    (mode === 'Departure' || mode === 'Map' || hasMoreItemsThanDisplayLimit);

  const situations = quay.situations.filter(isSituationValidAtDate(searchDate));
  const estimatedCallsWithData = departuresToDisplay
    .slice(0, departuresPerQuay)
    .map((departure) => {
      return {
        departure,
        navigateToDetails,
        stopPlace,
        quay,
        departuresPerQuay,
        addedFavoritesVisibleOnDashboard,
        allowFavouriteSelection,
        mode,
      } as EstimatedCallWithData;
    });

  const renderItem = useCallback(
    ({item, index}: EstimatedCallRenderItem) => (
      <GenericSectionItem radius={'bottom'} testID={'departureItem' + index}>
        <EstimatedCallItem
          departure={item.departure}
          quay={item.quay}
          stopPlace={item.stopPlace}
          addedFavoritesVisibleOnDashboard={
            item.addedFavoritesVisibleOnDashboard
          }
          allowFavouriteSelection={item.allowFavouriteSelection}
          navigateToDetails={item.navigateToDetails}
          mode={item.mode}
          testID={'departureItem' + index}
        />
      </GenericSectionItem>
    ),
    [],
  );
  return (
    <View testID={testID}>
      <Section style={styles.section}>
        <GenericClickableSectionItem
          onPress={() => {
            setIsMinimized(!isMinimized);
          }}
          accessibilityHint={
            isMinimized
              ? t(DeparturesTexts.quaySection.a11yExpand)
              : t(DeparturesTexts.quaySection.a11yMinimize)
          }
        >
          <View style={styles.stopPlaceHeader} testID={testID + 'HideAction'}>
            <View style={styles.stopPlaceHeaderText}>
              <ThemeText
                type="body__secondary--bold"
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
                  type="body__secondary"
                  color="secondary"
                  testID={testID + 'Description'}
                >
                  {quay.description}
                </ThemeText>
              )}
            </View>
            <ThemeIcon svg={isMinimized ? ExpandMore : ExpandLess} />
          </View>
        </GenericClickableSectionItem>
        {!isMinimized &&
          /*
           This is under its own 'isMinimized' as nesting section items in React
           fragment breaks the section separator.
           */
          situations.map((s) => <SituationSectionItem situation={s} />)}
        {!isMinimized && (
          <FlatList
            ItemSeparatorComponent={SectionSeparator}
            data={estimatedCallsWithData}
            renderItem={renderItem}
            removeClippedSubviews={true}
            windowSize={4}
            keyExtractor={(item: EstimatedCallWithData) =>
              // ServiceJourney ID is not a unique key if a ServiceJourney
              // passes by the same stop several times, (e.g. Ringen in Oslo)
              // which is why it is used in combination with aimedDepartureTime.
              item.departure.serviceJourney?.id +
              item.departure.aimedDepartureTime
            }
            ListEmptyComponent={
              <>
                {data && !isLoading && (
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
        )}
        {!isMinimized && didLoadingDataFail && !isLoading && (
          <GenericSectionItem>
            <View style={styles.messageBox}>
              <ThemeText type="body__secondary" color="secondary">
                {t(DeparturesTexts.message.noData)}
              </ThemeText>
            </View>
          </GenericSectionItem>
        )}
        {isLoading && !isMinimized && (
          <GenericSectionItem>
            <View style={{width: '100%'}}>
              <ActivityIndicator />
            </View>
          </GenericSectionItem>
        )}
        {shouldShowMoreItemsLink && (
          <LinkSectionItem
            icon="arrow-right"
            text={t(DeparturesTexts.quaySection.moreDepartures)}
            textType="body__primary--bold"
            onPress={() => navigateToQuay(quay)}
            accessibility={{
              accessibilityHint: t(DeparturesTexts.quaySection.a11yToQuayHint),
            }}
            testID={testID + 'More'}
          />
        )}
      </Section>
    </View>
  );
}

function getDeparturesForQuay(
  departures: EstimatedCall[] | null,
  quay: Quay,
): EstimatedCall[] {
  if (!departures) return [];
  return departures.filter((departure) => departure?.quay?.id === quay.id);
}

function compareByLineNameAndDesc(
  d1: EstimatedCall,
  d2: EstimatedCall,
): number {
  const lineNumber1 = d1.serviceJourney?.line.publicCode;
  const lineNumber2 = d2.serviceJourney?.line.publicCode;
  const lineDesc1 = d1?.destinationDisplay?.frontText;
  const lineDesc2 = d2?.destinationDisplay?.frontText;

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
    marginHorizontal: theme.spacings.medium,
    marginVertical: theme.spacings.medium,
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
    marginRight: theme.spacings.medium,
  },
  messageBox: {
    width: '100%',
    alignItems: 'center',
  },
}));
