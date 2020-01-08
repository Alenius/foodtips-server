const { ApolloServer, gql } = require('apollo-server');

const CUISINE_THAI = 'Thai';
const CUISINE_MEXICAN = 'Mexican';
const CUISINE_SWEDISH = 'Swedish';
const CUISINE_AFRICAN = 'African';
const CUISINE_ITALIAN = 'Italian';

const TAG_CURRY = 'Curry';
const TAG_WOK = 'Wok';
const TAG_BURRITO = 'Burrito';
const TAG_TACO = 'Taco';
const TAG_HUSMANSKOST = 'Husmanskost';
const TAG_ETHIOPIAN = 'Ethiopian';
const TAG_PIZZA = 'Pizza';
const TAG_PASTA = 'Pasta';
const TAG_STEW = 'Stew';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Recipe {
    title: String
    link: String
    cuisine: String
    tags: [String]
    vegetarian: Boolean
    vegan: Boolean
  }

  type Cuisine {
  cuisine: String
  tags: [String]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    recipes: [Recipe],
    cuisines: [Cuisine],
  }
`;

const recipes = [
  {
    title: 'Red Panaeng Curry',
    link: 'https://www.javligtgott.se/rod-panaeng-curry/',
    cuisine: CUISINE_THAI,
    tags: [TAG_CURRY],
    vegetarian: true,
    vegan: true
  },
  {
    title: 'Pasta con mozzarella',
    link: '',
    cuisine: CUISINE_ITALIAN,
    tags: [TAG_PASTA],
    vegetarian: true,
    vegan: false,
  },
  {
    title: 'Swedish meatballs',
    link: '',
    cuisine: CUISINE_SWEDISH,
    tags: [TAG_HUSMANSKOST],
    vegetarian: false,
    vegan: false
  },
  {
    title: 'Burrito bowls',
    link: 'https://www.budgetbytes.com/easiest-burrito-bowl-meal-prep/',
    cuisine: CUISINE_MEXICAN,
    tags: [TAG_BURRITO],
    vegetarian: true,
    vegan: false
  },
  {
    title: 'Vegan West African Stew',
    link: 'https://www.budgetbytes.com/african-peanut-stew-vegan/',
    cuisine: CUISINE_AFRICAN,
    tags: [TAG_STEW],
    vegetarian: true,
    vegan: true
  }
]

const foodInfo = [
  { cuisine: CUISINE_THAI, tags: [TAG_CURRY, TAG_WOK] },
  { cuisine: CUISINE_MEXICAN, tags: [TAG_BURRITO, TAG_TACO] },
  { cuisine: CUISINE_SWEDISH, tags: [TAG_HUSMANSKOST] },
  { cuisine: CUISINE_AFRICAN, tags: [TAG_ETHIOPIAN] },
  { cuisine: CUISINE_ITALIAN, tags: [TAG_PIZZA, TAG_PASTA] }
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    recipes: () => recipes,
    cuisines: () => foodInfo
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});