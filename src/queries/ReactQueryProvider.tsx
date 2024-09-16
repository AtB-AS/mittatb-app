import {shouldRetry} from '@atb/api/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {ReactNode} from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_, error) => {
        if (error instanceof AxiosError) {
          shouldRetry(error);
        }
        return false;
      },
      onError: (error: any) => {
        if (error?.config) {
          error.config.forceRefreshIdToken =
            error.config.authWithIdToken && error.response?.status === 401;
        }
      },
    },
  },
});

export const ReactQueryProvider = ({children}: {children: ReactNode}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
