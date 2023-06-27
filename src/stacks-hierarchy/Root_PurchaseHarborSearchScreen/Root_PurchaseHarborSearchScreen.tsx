import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {
  LocationSearchTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TextInput as InternalTextInput,
  View,
} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {TextInputSectionItem} from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {ScrollView} from 'react-native-gesture-handler';
import {GeoLocation} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useIsFocused} from '@react-navigation/native';
import {useDebounce} from '@atb/utils/useDebounce';
import {HarborResult} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/HarborResult';
import BoatStopPointSearchTexts from '@atb/translations/screens/subscreens/BoatStopPointSearch';
import haversine from 'haversine-distance';
import {useIsLoading} from '@atb/utils/use-is-loading';
import {ErrorType} from '@atb/api/utils';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {getStopPlaceConnections, getStopPlaces} from '@atb/api/stop-places';
import {StopPlace, StopPlaces} from '@atb/api/types/stopPlaces';

type Props = RootStackScreenProps<'Root_PurchaseHarborSearchScreen'>;

export const Root_PurchaseHarborSearchScreen = ({navigation, route}: Props) => {
  const {fromHarbor, fareProductTypeConfig} = route.params;

  const {t} = useTranslation();
  const inputRef = useRef<InternalTextInput>(null);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSave = (selectedZone: StopPlace) => {
    selectedZone &&
      navigation.navigate({
        name: 'Root_PurchaseOverviewScreen',
        params: {
          mode: 'Ticket',
          fareProductTypeConfig,
          fromHarbor: fromHarbor ?? selectedZone,
          toHarbor: fromHarbor ? selectedZone : undefined,
        },
        merge: true,
      });
  };

  const styles = useMapStyles();
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  const {harbors, isLoading, error} = useGetHarbors(fromHarbor?.id);

  useEffect(() => {
    if (error) {
      setErrorMessage(translateErrorType(error, t));
    }
  }, [error]);

  const debouncedText = useDebounce(text, 200);
  const [loc, setLoc] = useState<GeoLocation | undefined>(undefined);
  const {onCurrentLocation} = useCurrentLocation(setLoc);
  useEffect(() => {
    onCurrentLocation();
  }, []);

  const [boatStopPoints, setBoatStopPoints] = useState<StopPlaces | undefined>(
    undefined,
  );

  useEffect(() => {
    harbors && setBoatStopPoints(sortHarbors(harbors, loc));
  }, [harbors, loc]);

  useEffect(() => {
    if (debouncedText.length > 1 && harbors) {
      setBoatStopPoints(
        sortHarbors(harbors, loc).filter((harbor) => {
          return harbor.name
            .toLowerCase()
            .includes(debouncedText.toLowerCase());
        }),
      );
    } else {
      harbors && setBoatStopPoints(sortHarbors(harbors, loc));
    }
  }, [debouncedText]);

  const boatStopPointResults: StopPlaces = useMemo(() => {
    return boatStopPoints ?? [];
  }, [boatStopPoints]);

  const showEmptyResultText = !boatStopPointResults.length && !!debouncedText;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FullScreenHeader
          title={
            fromHarbor
              ? t(BoatStopPointSearchTexts.header.titleTo)
              : t(BoatStopPointSearchTexts.header.titleFrom)
          }
          leftButton={{type: 'back'}}
        />
      </View>
      <View style={styles.header}>
        <View style={styles.withMargin}>
          <TextInputSectionItem
            ref={inputRef}
            radius="top-bottom"
            label={
              fromHarbor
                ? t(BoatStopPointSearchTexts.stopPlaces.to)
                : t(BoatStopPointSearchTexts.stopPlaces.from)
            }
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={t(BoatStopPointSearchTexts.searchField.placeholder)}
            autoCorrect={false}
            autoComplete="off"
            testID="searchInput"
          />
        </View>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentBlock}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {isLoading && <ActivityIndicator />}
        {error && (
          <View style={styles.errorMessage}>
            <ScreenReaderAnnouncement message={errorMessage} />
            <MessageBox type="warning" message={errorMessage} />
          </View>
        )}

        <HarborResult
          harbors={boatStopPointResults}
          onSelect={onSave}
          showingNearest={!!loc && debouncedText.length < 2}
        />

        {showEmptyResultText && (
          <MessageBox
            type="info"
            message={t(BoatStopPointSearchTexts.messages.emptyResult)}
          />
        )}
      </ScrollView>
    </View>
  );
};

function useCurrentLocation(onSelectLocation: (location: GeoLocation) => void) {
  const {location, requestPermission} = useGeolocationState();

  const [recentlyAllowedGeo, setRecentlyAllowedGeo] = useState(false);

  const onCurrentLocation = useCallback(
    async function () {
      if (location) {
        onSelectLocation(location);
      } else {
        const status = await requestPermission();
        if (status === 'granted') {
          setRecentlyAllowedGeo(true);
        }
      }
    },
    [location, onSelectLocation, requestPermission],
  );

  useEffect(() => {
    if (recentlyAllowedGeo && location) {
      onSelectLocation(location);
    }
  }, [recentlyAllowedGeo, location]);

  return {onCurrentLocation};
}

function sortHarbors(harbors: StopPlaces, location?: GeoLocation): StopPlaces {
  return location
    ? harbors
        ?.map((stopPlace) => {
          return {
            id: stopPlace.id,
            name: stopPlace.name,
            distance:
              stopPlace?.latitude && stopPlace?.longitude
                ? haversine(location.coordinates, [
                    stopPlace.longitude,
                    stopPlace.latitude,
                  ])
                : 1,
          };
        })
        .filter((stopPlace) => !!stopPlace.distance)
        .sort((a, b) => a.distance - b.distance)
    : harbors.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
}

function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(LocationSearchTexts.messages.networkError);
    default:
      return t(LocationSearchTexts.messages.defaultError);
  }
}

function useGetHarbors(fromHarborId?: string) {
  const [error, setError] = useState<ErrorType | undefined>(undefined);
  const [isLoading, setIsLoading] = useIsLoading(true);
  const [harbors, setHarbors] = useState<StopPlaces | undefined>(undefined);

  const fetchHarbors = useCallback(() => {
    if (fromHarborId) {
      return getStopPlaceConnections(fromHarborId);
    } else {
      return getStopPlaces(
        [TransportMode.Water],
        [
          TransportSubmode.HighSpeedPassengerService,
          TransportSubmode.HighSpeedVehicleService,
        ],
      );
    }
  }, [fromHarborId]);

  useEffect(() => {
    setIsLoading(true);
    fetchHarbors()
      .then((harborsResult) => {
        setHarbors(harborsResult);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fromHarborId]);

  return {
    harbors,
    isLoading,
    error,
  };
}

const useMapStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  headerContainer: {
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  selectorButtons: {
    margin: theme.spacings.medium,
  },
  header: {
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  withMargin: {
    margin: theme.spacings.medium,
  },
  contentBlock: {
    margin: theme.spacings.medium,
  },
  errorMessage: {
    paddingVertical: theme.spacings.medium,
  },
  scroll: {
    flex: 1,
  },
}));
