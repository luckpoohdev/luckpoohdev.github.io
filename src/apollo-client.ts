import getConfig from 'next/config';
import { ApolloClient, from, InMemoryCache } from '@apollo/client'
import { createUploadLink  } from 'apollo-upload-client'

const { publicRuntimeConfig } = getConfig();

const uploadLink = createUploadLink({
  uri: `${publicRuntimeConfig.BASE_URL}/api/graphql`,
})

const client = new ApolloClient({
  link: from([uploadLink]),
  cache: new InMemoryCache(),
})

export default client