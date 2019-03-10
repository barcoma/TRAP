const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const request = require('request');


const PORT = 4000;

const app = express();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

var test = yelpRequest();

const resolvers = {
  Query: {
    hello: () => "Hello World"
  },
};


function yelpRequest() {
  var myJSONObject = `{
    business(id: "garaje-san-francisco") {
        name
        id
        rating
        url
    }
  }`
  
  request({
    url: "https://api.yelp.com/v3/graphql",
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      "Authorization": "Bearer FfLMJXvs0iVD5I5K8x5BHaz7dWbv64WzwSDOw0I_HkqNlc4aTaoUvd2KyFPAMi_Mhrqi-ABmzJbXhh-Tu44eqmeAuNwEZ6uJtDf5IyEaNlQkT_-dLnu5bwZK3_aAXHYx"
    },
    body: myJSONObject
  }, function (error, response, body){
    // console.log(body);
    return body;
  });
  
}

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)