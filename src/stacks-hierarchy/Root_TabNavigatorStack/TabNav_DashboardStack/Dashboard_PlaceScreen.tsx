import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {PlaceScreenComponent} from '@atb/screen-components/place-screen';
import {useIsFocused} from '@react-navigation/native';

type Props = DashboardScreenProps<'Dashboard_PlaceScreen'>;

export const Dashboard_PlaceScreen = ({navigation, route}: Props) => {
  const isFocused = useIsFocused();

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
      onPressClose={
        route.params.onCloseRoute
          ? () => navigation.popTo(route.params.onCloseRoute as any)
          : undefined
      }
      isFocused={isFocused}
    />
  );
};
