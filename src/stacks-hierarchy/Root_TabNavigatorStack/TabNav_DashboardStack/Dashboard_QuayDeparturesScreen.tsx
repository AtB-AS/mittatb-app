import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {QuayDeparturesScreenComponent} from '@atb/quay-departures-screen';

type Props = DashboardScreenProps<'Dashboard_QuayDeparturesScreen'>;

export const Dashboard_QuayDeparturesScreen = ({navigation, route}: Props) => (
  <QuayDeparturesScreenComponent
    {...route.params}
    onPressDeparture={(items, activeItemIndex) =>
      navigation.navigate('Dashboard_DepartureDetailsScreen', {
        items,
        activeItemIndex,
      })
    }
  />
);
