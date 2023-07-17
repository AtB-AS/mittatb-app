import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {useIsFocused} from '@react-navigation/native';
import {useDebounce} from '@atb/utils/useDebounce';
import {HarborResults} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/HarborResults';
import {useIsLoading} from '@atb/utils/use-is-loading';
import {ErrorType} from '@atb/api/utils';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  getStopPlaceConnections,
  getStopPlacesByMode,
} from '@atb/api/stop-places';
import {StopPlace, StopPlaces} from '@atb/api/types/stopPlaces';
import HarborSearchTexts from '@atb/translations/screens/subscreens/HarborSearch';
import {translateErrorType} from '@atb/stacks-hierarchy/utils';

type Props = RootStackScreenProps<'Root_PurchaseHarborSearchScreen'>;

export const Root_PurchaseHarborSearchScreen = ({navigation, route}: Props) => {
  const {fromHarbor, fareProductTypeConfig, preassignedFareProduct} =
    route.params;

  const {t} = useTranslation();
  const inputRef = useRef<InternalTextInput>(null);
  const [text, setText] = useState('');

  const onSave = (selectedStopPlace: StopPlace) => {
    selectedStopPlace &&
      navigation.navigate({
        name: 'Root_PurchaseOverviewScreen',
        params: {
          mode: 'Ticket',
          fareProductTypeConfig,
          preassignedFareProduct,
          fromHarbor: fromHarbor ?? selectedStopPlace,
          toHarbor: fromHarbor ? selectedStopPlace : undefined,
          onFocusElement: 'from-to-selection',
        },
        merge: true,
      });
  };

  const styles = useStyles();
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  const {harbors, isLoading, error} = useGetHarbors(fromHarbor?.id);

  const errorMessage = error ? translateErrorType(error, t) : '';

  const debouncedText = useDebounce(text, 200);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FullScreenHeader
          title={
            fromHarbor
              ? t(HarborSearchTexts.header.titleTo)
              : t(HarborSearchTexts.header.titleFrom)
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
                ? t(HarborSearchTexts.stopPlaces.to)
                : t(HarborSearchTexts.stopPlaces.from)
            }
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={t(HarborSearchTexts.searchField.placeholder)}
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

        <HarborResults
          harbors={harbors}
          onSelect={onSave}
          searchText={debouncedText}
          fromHarborName={fromHarbor?.name}
        />
      </ScrollView>
    </View>
  );
};

function useGetHarbors(fromHarborId?: string) {
  const [error, setError] = useState<ErrorType | undefined>(undefined);
  const [isLoading, setIsLoading] = useIsLoading(true);
  const [harbors, setHarbors] = useState<StopPlaces | []>([]);

  const fetchHarbors = useCallback(() => {
    if (fromHarborId) {
      return getStopPlaceConnections(fromHarborId);
    } else {
      return getStopPlacesByMode(
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
        setHarbors(harborsResult ?? []);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchHarbors]);

  return {
    harbors,
    isLoading,
    error,
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  headerContainer: {
    backgroundColor: theme.static.background.background_accent_0.background,
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
