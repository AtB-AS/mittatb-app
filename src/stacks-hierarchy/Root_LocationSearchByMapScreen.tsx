import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {ExploreLocationMap} from '@atb/modules/map';
import {Location} from '@atb/modules/favorites';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {updateCallerRouteParams} from './Root_LocationSearchByTextScreen/navigation-types';

export type Props = RootStackScreenProps<'Root_LocationSearchByMapScreen'>;

export const Root_LocationSearchByMapScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteConfig, initialLocation},
  },
}) => {
  const onLocationSelect = useCallback(
    (location?: Location) => {
      const callerRoute = updateCallerRouteParams(
        callerRouteConfig.route,
        callerRouteConfig.locationRouteParam,
        location,
      );
      navigation.popTo(...callerRoute);
    },
    [callerRouteConfig, navigation],
  );

  const styles = useMapStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.mapSelection.header.title)}
        leftButton={{type: 'back'}}
      />
      <ExploreLocationMap
        onLocationSelect={onLocationSelect}
        initialLocation={initialLocation}
      />
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));
