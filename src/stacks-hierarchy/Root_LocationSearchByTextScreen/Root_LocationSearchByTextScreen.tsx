import {useAccessibilityContext} from '@atb/modules/accessibility';
import React from 'react';
import {View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {SelectableLocationType} from './types';
import {LocationSearchContent} from './components/LocationSearchContent';
import {StyleSheet} from '@atb/theme';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = RootStackScreenProps<'Root_LocationSearchByTextScreen'>;

export const Root_LocationSearchByTextScreen = ({
  navigation,
  route: {
    params: {
      callerRouteName,
      callerRouteParam,
      label,
      favoriteChipTypes,
      initialLocation,
      includeJourneyHistory = false,
      onlyStopPlacesCheckboxInitialState,
    },
  },
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const onSelect = (location: SelectableLocationType) => {
    navigation.navigate({
      name: callerRouteName as any,
      params: {
        [callerRouteParam]: location,
      },
      merge: true,
    });
  };

  const onMapSelection = () => {
    navigation.navigate({
      name: 'Root_LocationSearchByMapScreen',
      params: {
        callerRouteName,
        callerRouteParam,
        initialLocation,
      },
      merge: true,
    });
  };

  const a11yContext = useAccessibilityContext();

  const focusRef = useFocusOnLoad(
    navigation,
    a11yContext.isScreenReaderEnabled,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.header.title)}
        rightButton={{type: 'close'}}
        focusRef={focusRef}
      />

      <LocationSearchContent
        onSelect={onSelect}
        onMapSelection={onMapSelection}
        label={label}
        favoriteChipTypes={favoriteChipTypes}
        placeholder={t(LocationSearchTexts.searchField.placeholder)}
        defaultText={
          initialLocation?.resultType === 'search'
            ? initialLocation.name
            : undefined
        }
        includeJourneyHistory={includeJourneyHistory}
        onlyStopPlacesCheckboxInitialState={onlyStopPlacesCheckboxInitialState}
        onAddFavoritePlace={() =>
          navigation.navigate('Root_SearchFavoritePlaceScreen')
        }
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[2].background,
    flex: 1,
  },
}));
