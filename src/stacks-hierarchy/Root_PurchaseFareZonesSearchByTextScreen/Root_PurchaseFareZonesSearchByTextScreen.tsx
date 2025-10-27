import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {TextInputSectionItem} from '@atb/components/sections';
import {FareZone} from '@atb/modules/configuration';
import {SearchLocation} from '@atb/modules/favorites';
import {useGeocoder} from '@atb/modules/geocoder';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {StyleSheet} from '@atb/theme';
import {
  FareZoneSearchTexts,
  FareZonesTexts,
  useTranslation,
} from '@atb/translations';
import {useDebounce} from '@atb/utils/use-debounce';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TextInput as InternalTextInput,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FareZoneResults} from '@atb/fare-zones-selector/FareZoneResults';
import {LocationAndFareZone, VenueResults} from './VenueResults';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {translateErrorType} from '@atb/stacks-hierarchy/utils';
import {
  usePurchaseSelectionBuilder,
  useSelectableFareZones,
} from '@atb/modules/purchase-selection';
import type {FareZoneWithMetadata} from '@atb/fare-zones-selector';

type Props = RootStackScreenProps<'Root_PurchaseFareZonesSearchByTextScreen'>;

export const Root_PurchaseFareZonesSearchByTextScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {selection, fromOrTo},
  },
}) => {
  const styles = useThemeStyles();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const [text, setText] = useState('');

  const debouncedText = useDebounce(text, 200);
  const {t} = useTranslation();

  const fareZones = useSelectableFareZones(selection.preassignedFareProduct);

  const getMatchingFareZone = useCallback(
    (location: SearchLocation) =>
      fareZones.find((fareZone) =>
        location.tariff_zones?.includes(fareZone.id),
      ),
    [fareZones],
  );

  const onSelectZone = (fareZone: FareZone) => {
    const zone: FareZoneWithMetadata = {...fareZone, resultType: 'zone'};
    navigateToMapScreen(zone);
  };

  const onSelectVenue = (location: SearchLocation) => {
    const fareZone = getMatchingFareZone(location);
    const zone: FareZoneWithMetadata | undefined = fareZone && {
      ...fareZone,
      resultType: 'venue',
      venueName: location.name,
    };
    navigateToMapScreen(zone);
  };

  const navigateToMapScreen = (zone?: FareZoneWithMetadata) => {
    const isApplicableOnSingleZoneOnly =
      selection.preassignedFareProduct.zoneSelectionMode?.includes('single') ||
      selection.fareProductTypeConfig.configuration.zoneSelectionMode.includes(
        'single',
      );

    const builder = selectionBuilder.fromSelection(selection);
    if (zone && (fromOrTo === 'from' || isApplicableOnSingleZoneOnly)) {
      builder.fromZone(zone);
    }
    if (zone && (fromOrTo === 'to' || isApplicableOnSingleZoneOnly)) {
      builder.toZone(zone);
    }
    const newSelection = builder.build();

    navigation.popTo('Root_PurchaseFareZonesSearchByMapScreen', {
      selection: newSelection,
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

  const {location: geolocation} = useGeolocationContext();

  const {locations, isSearching, error} =
    useGeocoder(debouncedText, geolocation?.coordinates ?? null, true) ?? [];

  const errorMessage = error ? translateErrorType(error, t) : undefined;

  const locationsAndFareZones: LocationAndFareZone[] = useMemo(
    () =>
      (locations || [])
        ?.filter((l): l is SearchLocation => l.resultType === 'search')
        ?.map((location) => ({
          location,
          fareZone: getMatchingFareZone(location),
        }))
        .filter(
          (locationAndFareZone): locationAndFareZone is LocationAndFareZone =>
            locationAndFareZone.fareZone != null,
        ),
    [locations, getMatchingFareZone],
  );

  const showActivityIndicator = isSearching && !locationsAndFareZones.length;
  const showFareZones = !debouncedText && !isSearching;
  const showVenueResults = !!locationsAndFareZones.length;
  const showEmptyResultText =
    !locationsAndFareZones.length && !!debouncedText && !isSearching;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(FareZoneSearchTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <View style={styles.header}>
        <View style={styles.withMargin}>
          <TextInputSectionItem
            ref={inputRef}
            radius="top-bottom"
            label={
              fromOrTo === 'from'
                ? t(FareZonesTexts.location.zonePicker.labelFrom)
                : t(FareZonesTexts.location.zonePicker.labelTo)
            }
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={t(FareZoneSearchTexts.searchField.placeholder)}
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
        {errorMessage && (
          <View style={styles.withMargin}>
            <MessageInfoBox type="warning" message={errorMessage} />
          </View>
        )}
        {showActivityIndicator && <ActivityIndicator />}
        {showFareZones && (
          <FareZoneResults fareZones={fareZones} onSelect={onSelectZone} />
        )}
        {showVenueResults && (
          <VenueResults
            locationsAndFareZones={locationsAndFareZones}
            onSelect={onSelectVenue}
          />
        )}
        {showEmptyResultText && (
          <MessageInfoBox
            type="info"
            message={t(FareZoneSearchTexts.messages.emptyResult)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
  header: {
    backgroundColor: theme.color.background.accent[0].background,
  },
  favouriteChips: {
    marginLeft: theme.spacing.medium,
  },
  withMargin: {
    margin: theme.spacing.medium,
  },
  contentBlock: {
    margin: theme.spacing.medium,
  },
  scroll: {
    flex: 1,
  },
}));
