import React, {useMemo} from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../ScreenHeader';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
import useChatIcon from '../../../chat/use-chat-icon';
import {useNavigateHome} from '../../../utils/navigation';
import {StyleSheet} from '../../../theme';
import colors from '../../../theme/colors';
import Active from './Active';
import Expired from './Expired';
import TabBar from './TabBar';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  const styles = useStyles();
  const chatIcon = useChatIcon();
  const navigateHome = useNavigateHome();
  const {top} = useSafeAreaInsets();
  const screenTopStyle = useMemo(
    () => ({
      paddingTop: top,
    }),
    [top],
  );

  return (
    <View style={[styles.container, screenTopStyle]}>
      <Header
        title="Billetter"
        rightButton={chatIcon}
        leftButton={{
          icon: <LogoOutline />,
          onPress: navigateHome,
          accessibilityLabel: 'Gå til startskjerm',
        }}
      />
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name="Active"
          component={Active}
          options={{tabBarLabel: 'Aktive'}}
        />
        <Tab.Screen
          name="Expired"
          component={Expired}
          options={{tabBarLabel: 'Utløpte'}}
        />
      </Tab.Navigator>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: colors.secondary.cyan},
}));
