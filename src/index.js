import  { ApolloServer } from 'apollo-server'

import typeDefs from './schema.graphql'
import resolvers from './resolvers'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    introspection: true,
    context: ({ req }) => ({
        authorization: req.headers.authorization
    })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
});
