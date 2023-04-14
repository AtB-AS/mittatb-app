import {ApolloClient, HttpLink, InMemoryCache, split} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';

export const getGraphqlEndpoint = () => {
  return 'https://api.staging.entur.io/realtime/v1/vehicles/graphql';
};

export const getSubscriptionsEndpoint = () => {
  return 'wss://api.staging.entur.io/realtime/v1/vehicles/subscriptions';
};
const httpLink = new HttpLink({
  uri: getGraphqlEndpoint(),
});

const wsLink = new WebSocketLink({
  uri: getSubscriptionsEndpoint(),
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
