const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

//const PORT = 4000;

const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// app.listen({ port: PORT }, () =>
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
// )

// app.listen(process.env.PORT || 5000)
// app.use('/', express.static('public/public'));

// import { ApolloEngine } from 'apollo-engine';
// const engine = new ApolloEngine();

// Set a default value of 3000 if we don't pass an env var
const PORT = process.env.PORT || 3000;

app.listen({
  port: PORT,
  expressApp: app
}, () => {
  console.log(`Server running on port ${PORT}!`);
});