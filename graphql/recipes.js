const { gql } = require("apollo-server");
const Recipe = require("../models/RecipeModel");
const { Tag } = require("../models/TagModel");
const { Cuisine } = require("../models/CuisineModel");

const mongoose = require("mongoose");

const recipeDef = gql`
  type Recipe {
    title: String
    link: String
    cuisine: String
    tags: [String]
    vegetarian: Boolean
    vegan: Boolean
  }

  type Query {
    getRecipe(cuisines: [String]): [Recipe]
    getAllRecipes: [Recipe]
    getAllTags: [String]
    getAllCuisines: [String]
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
    addTag(input: String): String
  }
`;

const mapCuisineAndTagsToString = recipeArr => {
  return recipeArr.flat().map(it => {
    const tagArr = it.tags.map(it => it.tag);
    const cuisine = it.cuisine.cuisine;
    return {
      title: it.title,
      link: it.link,
      vegetarian: it.vegetarian,
      vegan: it.vegan,
      cuisine,
      tags: tagArr
    };
  });
};

const recipeResolvers = {
  Query: {
    getRecipe: async (_, args) => {
      const { cuisines } = args;

      const cuisinePromiseArray = cuisines.map(
        async cuisine => await Cuisine.find({ cuisine })
      );
      const cuisineIDArray = await Promise.all(cuisinePromiseArray);

      const recipePromiseArr = cuisineIDArray.flat().map(async cuisineID => {
        const recipes = await Recipe.find({ cuisine: cuisineID._id })
          .populate("cuisine")
          .populate("tags");
        return recipes;
      });

      const recipeArr = await Promise.all(recipePromiseArr);
      const mappedArr = mapCuisineAndTagsToString(recipeArr);
      return mappedArr;
    },
    getAllRecipes: async () => {
      const recipes = await Recipe.find()
        .populate("cuisine")
        .populate("tags");

      const mappedArr = mapCuisineAndTagsToString(recipes);
      return mappedArr;
    },
    getAllTags: async () => {
      const tags = await Tag.find();
      return tags;
    },
    getAllCuisines: async () => {
      const cuisines = await Cuisine.find();
      const cuisineStrings = cuisines.map(it => it.cuisine);
      return cuisineStrings;
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
