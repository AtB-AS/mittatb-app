import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {LanguageAndText} from '@atb/reference-data/types';
import {Statuses} from '@atb/theme';

export type Alert = {
  active: boolean;
  title?: LanguageAndText[];
  body: LanguageAndText[];
  type: Statuses;
  context: AlertContext;
};

export type AlertContext =
  | 'app-assistant'
  | 'app-departures'
  | 'app-ticketing'
  | 'web-ticketing'
  | 'web-overview';

type AlertsContextState = {
  findAlert: (context: AlertContext) => Alert | undefined;
};

const defaultAlertState = {
  findAlert: () => undefined,
};

const AlertsContext = createContext<AlertsContextState>(defaultAlertState);

const AlertsContextProvider: React.FC = ({children}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState(false);

  useEffect(
    () =>
      firestore()
        .collection('alerts-v2')
        .where('active', '==', true)
        .onSnapshot(
          (snapshot) => {
            const alerts = (
              snapshot as FirebaseFirestoreTypes.QuerySnapshot<Alert>
            ).docs.map<Alert>((d) => d.data());
            setAlerts(alerts);
            setError(false);
          },
          (err) => {
            console.warn(err);
            setError(true);
          },
        ),
    [],
  );

  const findAlert = useCallback(
    (context: AlertContext) => {
      return alerts.filter((a) => a.context === context)[0];
    },
    [alerts],
  );

  return (
    <AlertsContext.Provider
      value={{
        findAlert,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export function useAlertsState() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error(
      'useAlertsState must be used within an AlertsContextProvider',
    );
  }
  return context;
}

export default AlertsContextProvider;
