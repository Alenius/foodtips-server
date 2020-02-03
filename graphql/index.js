const { mergeSchemas, makeExecutableSchema } = require("graphql-tools");

const {
  typeDefs: recipeDef,
  resolvers: recipeResolvers
} = require("./recipes");

const mergedSchema = mergeSchemas({
  schemas: [recipeDef]
});

const schema = makeExecutableSchema({
  typeDefs: mergedSchema,
  resolvers: recipeResolvers
});

const server = new ApolloServer(schema);

module.exports = { server };
