import {QueryClient} from '@tanstack/react-query';
import {ReactNode} from 'react';
import {isAxiosError} from 'axios';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_VERSION} from '@env';

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
    persistOptions={{
      persister: asyncStoragePersister,
      buster: APP_VERSION, // Discards the cache on app updates
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          // Makes storage opt-in for queries with meta.persistInAsyncStorage
          // set to true. When setting this for a query, be aware that when the
          // data contains non-serializable data, it may cause issues when
          // rehydrating. It's equivalent to `JSON.parse(JSON.stringify(data))`.
          return query.meta?.persistInAsyncStorage === true;
        },
        shouldDehydrateMutation: () => false, // Do not persist mutations
      },
    }}
  >
    {children}
  </PersistQueryClientProvider>
);
