import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {PlaceScreenComponent} from '@atb/screen-components/place-screen';

type Props = DashboardScreenProps<'Dashboard_PlaceScreen'>;

export const Dashboard_PlaceScreen = ({navigation, route}: Props) => {
  return (
    <PlaceScreenComponent
      {...route.params}
      onPressQuay={(quayId) => navigation.setParams({selectedQuayId: quayId})}
      onPressDeparture={(items, activeItemIndex) =>
        navigation.push('Dashboard_DepartureDetailsScreen', {
          items,
          activeItemIndex,
        })
      }
    />
  );
};
