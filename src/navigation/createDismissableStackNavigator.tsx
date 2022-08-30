import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  DefaultRouterOptions,
  NavigationState,
  ParamListBase,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import {StackNavigationProp, StackView} from '@react-navigation/stack';
import {StackNavigationConfig} from '@react-navigation/stack/lib/typescript/src/types';
import * as React from 'react';

export type DismissableStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
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
  StackNavigationConfig & {dismissToScreen: string} & DefaultNavigatorOptions<
      ParamListBase,
      NavigationState,
      {},
      Record<string, any>
    >
> = ({dismissToScreen, ...rest}) => {
  const {state, descriptors, navigation} = useNavigationBuilder(
    DismissableStackRouter,
    {...rest, dismissToScreen},
  );

  return (
    <StackView
      {...(rest as any)}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
};

export default createNavigatorFactory(DismissableStackNavigator);
