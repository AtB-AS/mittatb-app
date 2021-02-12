import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  DefaultRouterOptions,
  ParamListBase,
  StackRouter,
  StackRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import {
  StackNavigationOptions,
  StackNavigationProp,
  StackView,
} from '@react-navigation/stack';
import * as React from 'react';

export type DismissableStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {dismiss(params?: object): void} & StackNavigationProp<
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
      dismiss(params?: object) {
        return {
          type: 'NAVIGATE',
          payload: {name: options.dismissToScreen, params},
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
