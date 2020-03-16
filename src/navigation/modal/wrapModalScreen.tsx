import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {useUniqueModal} from './createModalStackNavigator';

type ModalScreenProps = {
  route: any;
  navigation: NavigationProp<any, any>;
};

const wrapModalScreen = (Component: React.ComponentType<any>) => {
  const ModalScreen: React.FC<ModalScreenProps> = ({route, navigation}) => {
    const {uniqueModalId} = route.params;
    const {state, onCloseModal} = useUniqueModal(uniqueModalId);
    React.useEffect(() => {
      return () => onCloseModal(uniqueModalId);
    }, []);
    return <Component {...state} navigation={navigation} />;
  };
  return ModalScreen;
};

export default wrapModalScreen;
