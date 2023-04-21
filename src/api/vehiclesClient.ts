import {ApolloClient, InMemoryCache} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';

const subscriptionEndpoint =
  'wss://api.staging.entur.io/realtime/v1/vehicles/subscriptions';

const wsLink = new WebSocketLink({
  uri: subscriptionEndpoint,
  options: {
    reconnect: true,
  },
});

export const vehiclesClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
