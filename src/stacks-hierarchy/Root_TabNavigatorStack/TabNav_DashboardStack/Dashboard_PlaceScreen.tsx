import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {PlaceScreenComponent} from '@atb/screen-components/place-screen';
import {useCallback} from 'react';

type Props = DashboardScreenProps<'Dashboard_PlaceScreen'>;

export const Dashboard_PlaceScreen = ({navigation, route}: Props) => {
  const onPressClose = useCallback(() => {
    if (route.params.onCloseRoute !== undefined) {
      navigation.popTo(...route.params.onCloseRoute);
    }
  }, [navigation, route.params.onCloseRoute]);

  return (
    <PlaceScreenComponent
      {...route.params}
      addedFavoritesVisibleOnDashboard={true}
      onPressQuay={(stopPlace, quayId, onlyReplaceParam) =>
        onlyReplaceParam
          ? navigation.setParams({selectedQuayId: quayId})
          : navigation.push('Dashboard_PlaceScreen', {
              place: stopPlace,
              selectedQuayId: quayId,
              mode: route.params.mode,
              onCloseRoute: route.params.onCloseRoute,
              addedFavoritesVisibleOnDashboard: true,
            })
      }
      onPressDeparture={(items, activeItemIndex) =>
        navigation.push('Dashboard_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
      onPressClose={onPressClose}
    />
  );
};
