import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactNode} from 'react';
import {isAxiosError} from 'axios';

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

export const ReactQueryProvider = ({children}: {children: ReactNode}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
