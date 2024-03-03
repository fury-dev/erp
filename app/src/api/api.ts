import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
const httpLink = createHttpLink({
  // uri: process?.env.REACT_APP_API_ENDPOINT as unknown as string
  //@ts-ignore
  uri: 'http://localhost:4000'
});
const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem('authToken') || ' {}');

  return {
    headers: {
      ...headers,
      authorization: token ? `${token.token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })
});

export default { client };
