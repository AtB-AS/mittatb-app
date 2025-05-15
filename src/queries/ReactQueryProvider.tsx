import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';

import {ReactNode} from 'react';
import {isAxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response?.status === 429) {
          return false;
        }
        return failureCount < 3; // Default is 3
      },
    },
  },
});

const persister = createSyncStoragePersister({
  storage: AsyncStorage,
});

export const ReactQueryProvider = ({children}: {children: ReactNode}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
