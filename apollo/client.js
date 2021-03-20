import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from '@apollo/client/link/error'

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      return alert(`Graphql error ${message}`)
    })
  }
})

const apolloLink = from([
  errorLink,
  new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_ENDPOINT + "v2",
      credentials: "include"      
  })
])

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false
  }),
  link: apolloLink
})