const { ApolloServer, gql } = require("apollo-server");
var mongoose = require("mongoose");
const { recipeDef, recipeResolvers } = require("./graphql/recipes");

mongoose.connect("mongodb://localhost/foodtips", { useNewUrlParser: true });
var db = mongoose.connection;

const server = new ApolloServer({
  typeDefs: recipeDef,
  resolvers: recipeResolvers
});
// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
