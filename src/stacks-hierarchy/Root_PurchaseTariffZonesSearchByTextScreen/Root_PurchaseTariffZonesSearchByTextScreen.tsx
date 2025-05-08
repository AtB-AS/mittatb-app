import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {TextInputSectionItem} from '@atb/components/sections';
import {TariffZone} from '@atb/modules/configuration';
import {SearchLocation} from '@atb/modules/favorites';
import {useGeocoder} from '@atb/geocoder';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {
  TariffZoneSearchTexts,
  TariffZonesTexts,
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
import {TariffZoneResults} from '@atb/tariff-zones-selector/TariffZoneResults';
import {LocationAndTariffZone, VenueResults} from './VenueResults';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {translateErrorType} from '@atb/stacks-hierarchy/utils';
import {
  usePurchaseSelectionBuilder,
  useSelectableTariffZones,
} from '@atb/modules/purchase-selection';
import type {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';

type Props = RootStackScreenProps<'Root_PurchaseTariffZonesSearchByTextScreen'>;

export const Root_PurchaseTariffZonesSearchByTextScreen: React.FC<Props> = ({
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

  const tariffZones = useSelectableTariffZones(
    selection.preassignedFareProduct,
  );

  const getMatchingTariffZone = useCallback(
    (location: SearchLocation) =>
      tariffZones.find((tariffZone) =>
        location.tariff_zones?.includes(tariffZone.id),
      ),
    [tariffZones],
  );

  const onSelectZone = (tariffZone: TariffZone) => {
    const zone: TariffZoneWithMetadata = {...tariffZone, resultType: 'zone'};
    navigateToMapScreen(zone);
  };

  const onSelectVenue = (location: SearchLocation) => {
    const tariffZone = getMatchingTariffZone(location);
    const zone: TariffZoneWithMetadata | undefined = tariffZone && {
      ...tariffZone,
      resultType: 'venue',
      venueName: location.name,
    };
    navigateToMapScreen(zone);
  };

  const navigateToMapScreen = (zone?: TariffZoneWithMetadata) => {
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

    navigation.navigate('Root_PurchaseTariffZonesSearchByMapScreen', {
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
    [locations, getMatchingTariffZone],
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
          <TextInputSectionItem
            ref={inputRef}
            radius="top-bottom"
            label={
              fromOrTo === 'from'
                ? t(TariffZonesTexts.location.zonePicker.labelFrom)
                : t(TariffZonesTexts.location.zonePicker.labelTo)
            }
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
        {errorMessage && (
          <View style={styles.withMargin}>
            <MessageInfoBox type="warning" message={errorMessage} />
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
          <MessageInfoBox
            type="info"
            message={t(TariffZoneSearchTexts.messages.emptyResult)}
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
