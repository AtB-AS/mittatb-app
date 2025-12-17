import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Theme} from '@atb/theme/colors';
import {RootStackScreenProps} from '../navigation-types';
import {
  onboardingCarouselConfigs,
  OnboardingCarouselStackParams,
} from '@atb/modules/onboarding';

const Tab = createMaterialTopTabNavigator<OnboardingCarouselStackParams>();
const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_OnboardingCarouselStack'>;

export const Root_OnboardingCarouselStack = ({route}: Props) => {
  const styles = useStyles();
  const {configId} = route.params;
  const config = onboardingCarouselConfigs.find(
    (onboardingConfig) => onboardingConfig.id === configId,
  );
  return (
    <Tab.Navigator
      tabBar={(props: MaterialTopTabBarProps) => (
        <PageIndicator
          index={props.state.index}
          count={props.state.routes.length}
        />
      )}
      tabBarPosition="bottom"
      initialRouteName={config?.onboardingScreens[0].name}
      style={styles.container}
    >
      {config?.onboardingScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  return {
    container: {
      flex: 1,
      backgroundColor: getThemeColor(theme).background,
      paddingBottom: safeAreaBottom,
    },
  };
});
