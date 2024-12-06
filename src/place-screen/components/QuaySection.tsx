import {EstimatedCall, Quay, StopPlace} from '@atb/api/types/departures';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {
  GenericClickableSectionItem,
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {
  DeparturesTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {isSituationValidAtDate, SituationSectionItem} from '@atb/situations';
import {EstimatedCallList} from '@atb/place-screen/components/EstimatedCallList';
import {formatDestinationDisplay} from '@atb/travel-details-screens/utils';

export type QuaySectionProps = {
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
    isCancelled?: boolean,
  ) => void;
  stopPlace: StopPlace;
  showOnlyFavorites: boolean;
  searchDate?: string | Date;
  addedFavoritesVisibleOnDashboard?: boolean;
  mode: StopPlacesMode;
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
      ? departures.sort((a, b) => compareByLineNameAndDesc(t, a, b))
      : departures;

  const navigateToQuayEnabled = !!navigateToQuay;

  // If the user has toggled "Show only favorites" and there are no favorites on
  // this quay, we should minimize the quay section.
  const hasFavorites = !!favoriteDepartures.find((f) => quay.id === f.quayId);
  const shouldBeMinimized =
    navigateToQuayEnabled && !hasFavorites && showOnlyFavorites;
  useEffect(() => {
    setIsMinimized(shouldBeMinimized);
  }, [shouldBeMinimized]);

  const hasMoreItemsThanDisplayLimit =
    !!departuresPerQuay && departuresToDisplay.length > departuresPerQuay;

  const shouldShowMoreItemsLink =
    navigateToQuayEnabled &&
    !isMinimized &&
    (mode === 'Departure' || mode === 'Map' || hasMoreItemsThanDisplayLimit);

  const situations = quay.situations.filter(isSituationValidAtDate(searchDate));

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
                typography="body__secondary--bold"
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
                  typography="body__secondary"
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
          situations.map((s) => (
            <SituationSectionItem key={s.id} situation={s} />
          ))}
        {!isMinimized && (
          <EstimatedCallList
            quay={quay}
            stopPlace={stopPlace}
            departures={departuresToDisplay.slice(0, departuresPerQuay)}
            mode={mode}
            addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
            shouldShowMoreItemsLink={shouldShowMoreItemsLink}
            navigateToDetails={navigateToDetails}
            showOnlyFavorites={showOnlyFavorites}
            noDeparturesToShow={!!data && !isLoading}
          />
        )}
        {!isMinimized && didLoadingDataFail && !isLoading && (
          <GenericSectionItem>
            <View style={styles.messageBox}>
              <ThemeText typography="body__secondary" color="secondary">
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
