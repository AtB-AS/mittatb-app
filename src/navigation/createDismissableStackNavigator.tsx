import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
  DefaultNavigatorOptions,
  StackRouterOptions,
  DefaultRouterOptions,
  ParamListBase,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import {
  StackNavigationOptions,
  StackNavigationProp,
  StackView,
} from '@react-navigation/stack';

export type DismissableStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {dismiss(params?: object & {screen: string}): void} & StackNavigationProp<
  ParamList,
  RouteName
>;

function DismissableStackRouter(
  options: DefaultRouterOptions & {dismissToScreen: string},
) {
  const router = StackRouter(options);
  return {
    ...router,
    actionCreators: {
      ...router.actionCreators,
      dismiss(params?: object & {screen: string}) {
        return {
          type: 'NAVIGATE',
          payload: {name: params?.screen || options.dismissToScreen, params},
        };
      },
    },
  };
}

const DismissableStackNavigator: React.FC<
  DefaultNavigatorOptions<StackNavigationOptions> &
    StackRouterOptions & {dismissToScreen: string}
> = ({initialRouteName, children, screenOptions, dismissToScreen, ...rest}) => {
  const {state, descriptors, navigation} = useNavigationBuilder(
    DismissableStackRouter,
    {
      initialRouteName,
      children,
      screenOptions,
      dismissToScreen,
    },
  );

  return (
    <StackView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
};

export default createNavigatorFactory(DismissableStackNavigator);
