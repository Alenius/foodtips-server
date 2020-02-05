const { gql } = require("apollo-server");
const Recipe = require("../models/RecipeModel");
const { Tag } = require("../models/TagModel");
const { Cuisine } = require("../models/CuisineModel");

const mongoose = require("mongoose");

const recipeDef = gql`
  type Cuisine {
    cuisine: String
  }

  type Tag {
    tag: String
  }

  type Recipe {
    title: String
    link: String
    cuisine: Cuisine
    tags: [Tag]
    vegetarian: Boolean
    vegan: Boolean
  }

  type Query {
    getRecipe(cuisines: [String]): [Recipe]
    getAllRecipes: [Recipe]
    getAllTags: [Tag]
    getAllCuisines: [Cuisine]
  }

  input TagInput {
    tag: String
  }

  input RecipeInput {
    title: String
    link: String
    cuisine: ID
    tags: [ID]
    vegetarian: Boolean
    vegan: Boolean
  }

  type Mutation {
    addRecipe(input: RecipeInput): Recipe
    addTag(input: TagInput): Tag
  }
`;

const recipeResolvers = {
  Query: {
    getRecipe: async (_, args) => {
      const { cuisines } = args;

      const cuisinePromiseArray = cuisines.map(
        async cuisine => await Cuisine.find({ cuisine })
      );
      const cuisineIDArray = await Promise.all(cuisinePromiseArray);

      const recipePromiseArr = cuisineIDArray.map(async cuisineID => {
        const recipes = await Recipe.find({ cuisine: cuisineID })
          .populate("cuisine")
          .populate("tags");
        return recipes;
      });

      const recipeArr = await Promise.all(recipePromiseArr);
      return recipeArr.flat();
    },
    getAllRecipes: async () => {
      const recipes = await Recipe.find()
        .populate("cuisine")
        .populate("tags");
      return recipes;
    },
    getAllTags: async () => {
      const tags = await Tag.find();
      return tags;
    },
    getAllCuisines: async () => {
      const cuisines = await Cuisine.find();
      return cuisines;
    }
  },
  Mutation: {
    addRecipe: async (_, args) => {
      try {
        const { title, link, cuisine, tags, vegetarian, vegan } = args.input;
        const recipe = await new Recipe({
          title,
          link,
          vegetarian,
          vegan
        });

        // check if the cuisine object exists, otherwise create it
        const cuisineObject = await Cuisine.findOneAndUpdate(
          {
            cuisine
          },
          {}, // is the update to apply, which we do not want to do
          // upsert creates a new document if nothing is found, new returns the new object
          { upsert: true, new: true }
        );
        recipe.cuisine = cuisineObject;

        const tagArray = await tags.map(async it => {
          const tag = Tag.findOneAndUpdate(
            { tag: it },
            {},
            { upsert: true, new: true }
          ).exec();
          return tag;
        });
        return Promise.all(tagArray).then(async tags => {
          recipe.tags = tags;
          await recipe.save();
          return recipe;
        });
      } catch (err) {
        return err;
      }
    },
    addTag: async (_, args) => {
      const recipe = await new Tag({ ...args.input }).save(0);
      return recipe;
    }
  }
};

module.exports = { recipeDef, recipeResolvers };
