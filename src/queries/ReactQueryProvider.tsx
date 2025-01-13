import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactNode} from 'react';
import type {AxiosError} from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 429) {
          return false;
        }
        return failureCount < 3; // Default is 3
      },
    },
  },
});

export const ReactQueryProvider = ({children}: {children: ReactNode}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
