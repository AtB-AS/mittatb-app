import {FullScreenHeader} from '@atb/components/screen-header';
import {RootStackScreenProps} from '../navigation-types';
import {useState} from 'react';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {PageIndicator} from '@atb/components/page-indicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@atb/theme';
import {ParkingViolationsReportingStackParams} from './navigation-types';
import {ParkingViolations_SelectViolation} from './ParkingViolations_SelectViolation';
import {StaticColorByType} from '@atb/theme/colors';
import {ParkingViolationsContextProvider} from './ParkingViolationsContext';
import {ParkingViolations_Photo} from './ParkingViolations_Photo';

const Tab =
  createMaterialTopTabNavigator<ParkingViolationsReportingStackParams>();
type Props = RootStackScreenProps<'Root_ParkingViolationsReportingStack'>;
export const themeColor: StaticColorByType<'background'> =
  'background_accent_0';

export const Root_ParkingViolationsReportingStack = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState<any>();
  const [tabCount, setTabCount] = useState(0);
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <ParkingViolationsContextProvider>
      <FullScreenHeader
        leftButton={
          activeTab === 0
            ? {
                type: 'close',
                analyticsEventContext: 'Parking violations',
              }
            : {
                type: 'back',
                onPress: () => {
                  navigation.navigate(previousTab);
                },
              }
        }
        rightButton={
          activeTab !== tabCount - 1 && activeTab !== 0
            ? {type: 'close'}
            : undefined
        }
        setFocusOnLoad={false}
      />
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => {
          setActiveTab(props.state.index);
          setTabCount(props.state.routes.length);
          setPreviousTab(props.state.routes[props.state.index - 1]);
          return <PageIndicator {...props} />;
        }}
        style={{
          paddingBottom: Math.max(safeAreaBottom, theme.spacings.medium),
          backgroundColor: theme.static.background[themeColor].background,
        }}
        tabBarPosition="bottom"
        initialRouteName="ParkingViolations_SelectViolation"
      >
        <Tab.Screen
          name="ParkingViolations_SelectViolation"
          component={ParkingViolations_SelectViolation}
        />
        <Tab.Screen
          name="ParkingViolations_Photo"
          component={ParkingViolations_Photo}
        />
      </Tab.Navigator>
    </ParkingViolationsContextProvider>
  );
};
