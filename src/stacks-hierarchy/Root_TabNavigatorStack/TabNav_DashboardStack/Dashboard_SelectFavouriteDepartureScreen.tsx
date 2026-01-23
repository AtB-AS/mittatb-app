import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {SelectFavoriteDeparturesScreenComponent} from '@atb/screen-components/favorite-departures';

type Props = DashboardScreenProps<'Dashboard_SelectFavouriteDeparturesScreen'>;

export type SelectFavouriteDeparturesScreenParams = {
  place: StopPlace;
  selectedQuay?: Quay;
  limitPerQuay: number;
  addedFavoritesVisibleOnDashboard?: boolean;
};

export const Dashboard_SelectFavouriteDeparturesScreen = ({
  navigation,
  route,
}: Props) => {
  return (
    <SelectFavoriteDeparturesScreenComponent
      place={route.params.place}
      addedFavoritesVisibleOnDashboard={true}
      limitPerQuay={route.params.limitPerQuay}
      selectedQuay={route.params.selectedQuay}
      onPressClose={() =>
        navigation.popTo('Dashboard_FavoriteDeparturesScreen')
      }
      onNavigateToQuay={(selectedQuay: Quay) =>
        navigation.push('Dashboard_SelectFavouriteDeparturesScreen', {
          place: route.params.place,
          selectedQuay,
          limitPerQuay: 1000,
          addedFavoritesVisibleOnDashboard: true,
        })
      }
    />
  );
};
