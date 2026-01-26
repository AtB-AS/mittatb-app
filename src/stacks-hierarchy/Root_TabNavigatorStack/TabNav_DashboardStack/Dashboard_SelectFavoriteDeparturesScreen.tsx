import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {SelectFavoriteDeparturesScreenComponent} from '@atb/screen-components/favorite-departures';

type Props = DashboardScreenProps<'Dashboard_SelectFavoriteDeparturesScreen'>;

export type SelectFavoriteDeparturesScreenParams = {
  place: StopPlace;
  selectedQuay?: Quay;
  limitPerQuay: number;
  addedFavoritesVisibleOnDashboard?: boolean;
};

export const Dashboard_SelectFavoriteDeparturesScreen = ({
  navigation,
  route,
}: Props) => {
  return (
    <SelectFavoriteDeparturesScreenComponent
      {...route.params}
      addedFavoritesVisibleOnDashboard={true}
      onPressClose={() => navigation.popTo(route.params.onCloseRouteName, {})}
      onNavigateToQuay={(selectedQuay: Quay) =>
        navigation.push('Dashboard_SelectFavoriteDeparturesScreen', {
          place: route.params.place,
          selectedQuay,
          limitPerQuay: 1000,
          addedFavoritesVisibleOnDashboard: true,
          onCloseRouteName: route.params.onCloseRouteName,
        })
      }
    />
  );
};
