import {StaticColorByType} from '@atb/theme/colors';
import {createStackNavigator} from '@react-navigation/stack';
import {ParkingViolationsContextProvider} from './ParkingViolationsContext';
import {ParkingViolations_Photo} from './ParkingViolations_Photo';
import {ParkingViolations_Qr} from './ParkingViolations_Qr';
import {ParkingViolations_SelectViolation} from './ParkingViolations_SelectViolation';
import {ParkingViolationsReportingStackParams} from './navigation-types';

const Screen = createStackNavigator<ParkingViolationsReportingStackParams>();
export const themeColor: StaticColorByType<'background'> =
  'background_accent_0';

export const Root_ParkingViolationsReportingStack = () => {
  return (
    <ParkingViolationsContextProvider>
      <Screen.Navigator
        initialRouteName="ParkingViolations_SelectViolation"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Screen.Screen
          name="ParkingViolations_SelectViolation"
          component={ParkingViolations_SelectViolation}
        />
        <Screen.Screen
          name="ParkingViolations_Photo"
          component={ParkingViolations_Photo}
        />
        <Screen.Screen
          name="ParkingViolations_Qr"
          component={ParkingViolations_Qr}
        />
      </Screen.Navigator>
    </ParkingViolationsContextProvider>
  );
};
