import {useAccessibilityContext} from '@atb/AccessibilityContext';
import React from 'react';
import {View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {LocationSearchTexts, useTranslation} from '../translations/';
import {SelectableLocationType} from './types';
import {LocationSearchContent} from './components/LocationSearchContent';
import {StyleSheet} from '@atb/theme';
import {LocationSearchStackScreenProps} from './navigation-types';

type Props = LocationSearchStackScreenProps<'LocationSearchByTextScreen'>;

export const LocationSearchByTextScreen = ({
  navigation,
  route: {
    params: {
      callerRouteName,
      callerRouteParam,
      label,
      favoriteChipTypes,
      initialLocation,
      includeJourneyHistory = false,
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
      name: 'LocationSearchByMapScreen',
      params: {
        callerRouteName,
        callerRouteParam,
        initialLocation,
      },
      merge: true,
    });
  };

  const a11yContext = useAccessibilityContext();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.header.title)}
        leftButton={{type: 'close'}}
        setFocusOnLoad={a11yContext.isScreenReaderEnabled}
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
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_2.background,
    flex: 1,
  },
}));
