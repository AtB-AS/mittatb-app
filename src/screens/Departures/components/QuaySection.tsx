import {
  EstimatedCall,
  Place as StopPlace,
  Quay,
} from '@atb/api/types/departures';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import * as Sections from '@atb/components/sections';
import SectionSeparator from '@atb/components/sections/section-separator';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import EstimatedCallItem from './EstimatedCallItem';

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
  onFavouriteClosed?: () => void;
  stopPlace: StopPlace;
  showOnlyFavorites: boolean;
};

type EstimatedCallRenderItem = {
  item: EstimatedCall;
  index: number;
};

export default function QuaySection({
  quay,
  departuresPerQuay,
  data,
  testID,
  navigateToQuay,
  navigateToDetails,
  onFavouriteClosed,
  stopPlace,
  showOnlyFavorites,
}: QuaySectionProps): JSX.Element {
  const {favoriteDepartures} = useFavorites();
  const [isMinimized, setIsMinimized] = useState(false);
  const styles = useStyles();
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();

  useEffect(() => {
    if (!showOnlyFavorites) return setIsMinimized(false);
    setIsMinimized(
      !!navigateToQuay &&
        !favoriteDepartures.find((favorite) => quay.id === favorite.quayId),
    );
  }, [showOnlyFavorites]);

  return (
    <View testID={testID}>
      <Sections.Section withPadding withBottomPadding>
        <Sections.GenericClickableItem
          type="inline"
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
        </Sections.GenericClickableItem>
        {!isMinimized && (
          <FlatList
            ItemSeparatorComponent={SectionSeparator}
            data={departures && departures.slice(0, departuresPerQuay)}
            renderItem={({item: departure, index}: EstimatedCallRenderItem) => (
              <Sections.GenericItem
                radius={
                  !navigateToQuay && index === departures.length - 1
                    ? 'bottom'
                    : undefined
                }
                testID={'departureItem' + index}
              >
                <EstimatedCallItem
                  departure={departure}
                  testID={'departureItem' + index}
                  quay={quay}
                  stopPlace={stopPlace}
                  navigateToDetails={navigateToDetails}
                  onFavouriteClosed={onFavouriteClosed}
                />
              </Sections.GenericItem>
            )}
            keyExtractor={(item: EstimatedCall) =>
              // ServiceJourney ID is not a unique key if a ServiceJourney
              // passes by the same stop several times, (e.g. Ringen in Oslo)
              // which is why it is used in combination with aimedDepartureTime.
              item.serviceJourney?.id + item.aimedDepartureTime
            }
            ListEmptyComponent={
              <>
                {data && (
                  <Sections.GenericItem
                    radius={!navigateToQuay ? 'bottom' : undefined}
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
                  </Sections.GenericItem>
                )}
              </>
            }
          />
        )}
        {!data && !isMinimized && (
          <Sections.GenericItem>
            <View style={{width: '100%'}}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </Sections.GenericItem>
        )}
        {navigateToQuay && !isMinimized && (
          <Sections.LinkItem
            icon="arrow-right"
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            textType="body__primary--bold"
            onPress={() => navigateToQuay(quay)}
            accessibility={{
              accessibilityHint: t(DeparturesTexts.quaySection.a11yToQuayHint),
            }}
            testID={testID + 'More'}
          ></Sections.LinkItem>
        )}
      </Sections.Section>
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  stopPlaceHeader: {
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
  },
  stopPlaceHeaderText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  rightMargin: {
    marginRight: theme.spacings.medium,
  },
}));
