import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TextInput as InternalTextInput,
  View,
} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {TextInputSectionItem} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useDebounce} from '@atb/utils/use-debounce';
import {HarborResults} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/HarborResults';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import HarborSearchTexts from '@atb/translations/screens/subscreens/HarborSearch';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {useHarbors} from '@atb/modules/harbors';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = RootStackScreenProps<'Root_PurchaseHarborSearchScreen'>;

export const Root_PurchaseHarborSearchScreen = ({
  navigation,
  route: {
    params: {selection},
  },
}: Props) => {
  const {t} = useTranslation();
  const inputRef = useRef<InternalTextInput>(null);
  const [text, setText] = useState('');
  const selectionBuilder = usePurchaseSelectionBuilder();

  const onSave = (selectedStopPlace: StopPlaceFragment) => {
    const builder = selectionBuilder.fromSelection(selection);
    if (!selection.stopPlaces?.from) builder.fromStopPlace(selectedStopPlace);
    if (selection.stopPlaces?.from) builder.toStopPlace(selectedStopPlace);
    const newSelection = builder.build();
    navigation.navigate({
      name: 'Root_PurchaseOverviewScreen',
      params: {
        mode: 'Ticket',
        selection: newSelection,
        onFocusElement: selection.stopPlaces?.from ? 'toHarbor' : 'fromHarbor',
      },
      merge: true,
    });
  };

  const styles = useStyles();
  // capturing focus on mount and on press
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && giveFocus(inputRef);
  }, [isFocused]);
  const harborsQuery = useHarbors({
    fromHarborId: selection.stopPlaces?.from?.id,
    transportModes: selection.fareProductTypeConfig.transportModes,
  });

  const debouncedText = useDebounce(text, 200);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FullScreenHeader
          title={
            selection.stopPlaces?.from
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
              selection.stopPlaces?.from
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
        {harborsQuery.isLoading && <ActivityIndicator />}
        {harborsQuery.isError && (
          <>
            <ScreenReaderAnnouncement message={t(dictionary.genericErrorMsg)} />
            <MessageInfoBox
              type="error"
              message={t(dictionary.genericErrorMsg)}
              onPressConfig={{
                text: t(dictionary.retry),
                action: harborsQuery.refetch,
              }}
            />
          </>
        )}
        {harborsQuery.isSuccess && (
          <HarborResults
            harbors={harborsQuery.data ?? []}
            onSelect={onSave}
            searchText={debouncedText}
            fromHarborName={selection.stopPlaces?.from?.name}
          />
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom: bottomSafeAreaInset} = useSafeAreaInsets();
  return {
    container: {
      flex: 1,
      backgroundColor: theme.color.background.neutral[2].background,
      paddingBottom: bottomSafeAreaInset,
    },
    headerContainer: {
      backgroundColor: theme.color.background.accent[0].background,
    },
    header: {
      backgroundColor: theme.color.background.accent[0].background,
    },
    withMargin: {
      margin: theme.spacing.medium,
    },
    contentBlock: {
      marginHorizontal: theme.spacing.medium,
    },
    scroll: {
      flex: 1,
    },
  };
});
