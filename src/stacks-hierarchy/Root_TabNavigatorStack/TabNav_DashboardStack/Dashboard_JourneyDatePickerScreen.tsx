import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {JourneyDatePickerScreenComponent} from '@atb/journey-date-picker';

type Props = DashboardScreenProps<'Dashboard_JourneyDatePickerScreen'>;

export const Dashboard_JourneyDatePickerScreen = ({
  navigation,
  route,
}: Props) => {
  return (
    <JourneyDatePickerScreenComponent
      {...route.params}
      onSave={(searchTime) =>
        navigation.navigate('Dashboard_TripSearchScreen', {searchTime})
      }
    />
  );
};
