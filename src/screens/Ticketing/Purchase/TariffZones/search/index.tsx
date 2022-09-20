import {ErrorType} from '@atb/api/utils';
import MessageBox from '@atb/components/message-box';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {TextInput} from '@atb/components/sections';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {SearchLocation} from '@atb/favorites/types';
import {useGeocoder} from '@atb/geocoder';
import {useGeolocationState} from '@atb/GeolocationContext';
import {TariffZone} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {
  TariffZoneSearchTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import useDebounce from '@atb/utils/useDebounce';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TextInput as InternalTextInput,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TicketPurchaseScreenProps} from '../../types';
import TariffZoneResults from './TariffZoneResults';
import VenueResults, {LocationAndTariffZone} from './VenueResults';

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
};

export type Props = TicketPurchaseScreenProps<'TariffZoneSearch'>;

const Index: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, label},
  },
}) => {
  const styles = useThemeStyles();

  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const debouncedText = useDebounce(text, 200);
  const {t} = useTranslation();

  const {tariffZones} = useFirestoreConfiguration();

  const getMatchingTariffZone = (location: SearchLocation) =>
    tariffZones.find((tariffZone) =>
      location.tariff_zones?.includes(tariffZone.id),
    );

  const onSelectZone = (tariffZone: TariffZone) => {
    navigation.navigate({
      name: callerRouteName as any,
      params: {
        [callerRouteParam]: {
          ...tariffZone,
          resultType: 'zone',
        },
      },
      merge: true,
    });
  };

  const onSelectVenue = (location: SearchLocation) => {
    const tariffZone = getMatchingTariffZone(location);
    navigation.navigate({
      name: callerRouteName as any,
      params: {
        [callerRouteParam]: {
          ...tariffZone,
          resultType: 'venue',
          venueName: location.name,
        },
      },
      merge: true,
    });
  };

  const inputRef = useRef<InternalTextInput>(null);

  const isFocused = useIsFocused();

  // using setTimeout to counteract issue of other elements
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  const {location: geolocation} = useGeolocationState();

  const {locations, isSearching, error} =
    useGeocoder(debouncedText, geolocation?.coordinates ?? null, true) ?? [];

  useEffect(() => {
    if (error) {
      setErrorMessage(translateErrorType(error, t));
    }
  }, [error]);

  const locationsAndTariffZones: LocationAndTariffZone[] = useMemo(
    () =>
      (locations || [])
        ?.filter((l): l is SearchLocation => l.resultType === 'search')
        ?.map((location) => ({
          location,
          tariffZone: getMatchingTariffZone(location),
        }))
        .filter(
          (
            locationAndTariffZone,
          ): locationAndTariffZone is LocationAndTariffZone =>
            locationAndTariffZone.tariffZone != null,
        ),
    [locations],
  );

  const showActivityIndicator = isSearching && !locationsAndTariffZones.length;
  const showTariffZones = !debouncedText && !isSearching;
  const showVenueResults = !!locationsAndTariffZones.length;
  const showEmptyResultText =
    !locationsAndTariffZones.length && !!debouncedText && !isSearching;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TariffZoneSearchTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <View style={styles.header}>
        <View style={styles.withMargin}>
          <TextInput
            ref={inputRef}
            radius="top-bottom"
            label={label}
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={t(TariffZoneSearchTexts.searchField.placeholder)}
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
        {error && (
          <View style={styles.withMargin}>
            <MessageBox type="warning" message={errorMessage} />
          </View>
        )}
        {showActivityIndicator && <ActivityIndicator />}
        {showTariffZones && (
          <TariffZoneResults
            tariffZones={tariffZones}
            onSelect={onSelectZone}
          />
        )}
        {showVenueResults && (
          <VenueResults
            locationsAndTariffZones={locationsAndTariffZones}
            onSelect={onSelectVenue}
          />
        )}
        {showEmptyResultText && (
          <MessageBox
            type="info"
            message={t(TariffZoneSearchTexts.messages.emptyResult)}
          />
        )}
      </ScrollView>
    </View>
  );
};

function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(TariffZoneSearchTexts.messages.networkError);
    default:
      return t(TariffZoneSearchTexts.messages.defaultError);
  }
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_2.background,
    flex: 1,
  },
  header: {
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  favouriteChips: {
    marginLeft: theme.spacings.medium,
  },
  withMargin: {
    margin: theme.spacings.medium,
  },
  contentBlock: {
    margin: theme.spacings.medium,
  },
  scroll: {
    flex: 1,
  },
}));

export default Index;
