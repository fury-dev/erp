import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import axiosInstance from 'axios';
const httpLink = createHttpLink({
  // uri: process?.env.REACT_APP_API_ENDPOINT as unknown as string
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
const axios = axiosInstance.create({
  url: 'url'
});

axios.interceptors.request.use(async (config: any) => {
  if (['post', 'get', 'put', 'delete'].includes(config.method)) {
    try {
      config.headers['X-CSCAPI-KEY'] = process.env.LOCATION_API_KEY;
      config.headers['Access-Control-Allow-Origin'] = '*';
    } catch (e) {
      console.error(e);
    }
    return config;
  }
});
export { client, axios };
