import {QueryClient} from '@tanstack/react-query';
import {ReactNode} from 'react';
import {isAxiosError} from 'axios';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
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
      refetchOnWindowFocus: false,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const ReactQueryProvider = ({children}: {children: ReactNode}) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{persister: asyncStoragePersister}}
  >
    {children}
  </PersistQueryClientProvider>
);
