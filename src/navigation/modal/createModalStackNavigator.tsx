import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  StackRouter,
  DefaultNavigatorOptions,
  StackRouterOptions,
  StackNavigationState,
} from '@react-navigation/native';
import {StackView, StackNavigationOptions} from '@react-navigation/stack';
import {
  StackNavigationConfig,
  StackNavigationEventMap,
} from '@react-navigation/stack/lib/typescript/src/types';
import uuid from 'uuid/v4';

type ModalState = {
  [key: string]: object;
};

type ModalReducerAction =
  | {type: 'SET_PARAMS'; uniqueModalId: string; params: object}
  | {type: 'DELETE_PARAMS'; uniqueModalId: string};

type ModalContext = {modalState: ModalState} & {
  openModal: (
    screenName: string,
    contextParams: {[key: string]: string | object},
  ) => void;
  onCloseModal: (uniqueModalId: string) => void;
};

type ModalReducer = (
  prevState: ModalState,
  action: ModalReducerAction,
) => ModalState;

const modalReducer: ModalReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_PARAMS':
      return {
        ...prevState,
        [action.uniqueModalId]: action.params,
      };
    case 'DELETE_PARAMS':
      const {[action.uniqueModalId]: except, ...rest} = prevState;
      return rest;
  }
};

const defaultModalState: ModalState = {};

export default function createModalStackNavigator<
  ParamList extends Record<string, object | undefined>
>() {
  const ModalContext = React.createContext<ModalContext | undefined>(undefined);

  type Props = DefaultNavigatorOptions<StackNavigationOptions> &
    StackRouterOptions &
    StackNavigationConfig;

  function ModalStackNavigator({
    initialRouteName,
    children,
    screenOptions,
    ...rest
  }: Props) {
    const [modalState, dispatch] = React.useReducer<ModalReducer>(
      modalReducer,
      defaultModalState,
    );

    const {state, descriptors, navigation} = useNavigationBuilder<
      StackNavigationState,
      StackRouterOptions,
      StackNavigationOptions,
      StackNavigationEventMap
    >(StackRouter, {
      initialRouteName,
      children,
      screenOptions,
    });

    const {openModal, onCloseModal} = React.useMemo(
      () => ({
        openModal: async (
          screenName: string,
          params: {[key: string]: string | object},
        ) => {
          const uniqueModalId = uuid();
          dispatch({type: 'SET_PARAMS', uniqueModalId, params});
          navigation.navigate(screenName, {uniqueModalId});
        },
        onCloseModal: async (uniqueModalId: string) => {
          dispatch({type: 'DELETE_PARAMS', uniqueModalId});
        },
      }),
      [navigation],
    );

    return (
      <ModalContext.Provider value={{modalState, openModal, onCloseModal}}>
        <StackView
          {...rest}
          state={state}
          navigation={navigation}
          descriptors={descriptors}
        />
      </ModalContext.Provider>
    );
  }

  const navigatorFactory = createNavigatorFactory<
    StackNavigationState,
    StackNavigationOptions,
    StackNavigationEventMap,
    typeof ModalStackNavigator
  >(ModalStackNavigator);

  const {Navigator, Screen} = navigatorFactory<ParamList>();

  function useUniqueModal(uniqueModalId: string) {
    const context = React.useContext(ModalContext);
    if (context === undefined) {
      throw new Error(
        'useUniqueModalState must be used within a ModalContextProvider',
      );
    }
    return {
      state: context.modalState[uniqueModalId],
      onCloseModal: context.onCloseModal,
    };
  }

  function useOpenModal() {
    const context = React.useContext(ModalContext);
    if (context === undefined) {
      throw new Error(
        'useModalActions must be used within a ModalContextProvider',
      );
    }
    return context.openModal;
  }

  return {
    Navigator,
    Screen,
    useUniqueModal,
    useOpenModal,
  };
}
