import React, {useEffect, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useCurrentUser} from './AuthContext';

export enum Features {
  Ticketing = 'ticketing',
}

type FeatureToggleState = {
  [K in Features]: boolean;
};

const initialState = {ticketing: false};

const FeatureToggleContext = React.createContext<FeatureToggleState>(
  initialState,
);

export const FeatureToggleContextProvider: React.FC = (props) => {
  const currentUser = useCurrentUser();
  const [features, setFeatures] = useState<FeatureToggleState>(initialState);

  useEffect(() => {
    const fetchUserFeatures = async (uid: string | null) => {
      const snap = await firestore()
        .collection('features')
        .doc(uid ? uid : 'default')
        .get();

      const features = snap.data() as FeatureToggleState;
      features ? setFeatures(features) : setFeatures(initialState);
    };

    fetchUserFeatures(currentUser);
  }, [currentUser]);
  return (
    <FeatureToggleContext.Provider value={features}>
      {props.children}
    </FeatureToggleContext.Provider>
  );
};

export function useFeatureToggle(feature: Features) {
  const ctx = useContext(FeatureToggleContext);
  if (ctx === undefined) {
    throw new Error(
      'useFeatureToggle must be used within a FeatureToggleContextProvider',
    );
  }

  return ctx[feature];
}
