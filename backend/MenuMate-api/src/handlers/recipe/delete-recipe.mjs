import { deleteRecipe } from "../repositories/recipe-repository.mjs";

export const handler = async (event) => {
  try {
    const recipeId = event.pathParameters?.recipeId;

    if (!recipeId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "recipeId is required",
        }),
      };
    }
    const recipe = await deleteRecipe(recipeId);

    if (!recipe) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Recipe not found",
        }),
      };
    }
    return {
      statusCode: 204,
    };
  } catch (error) {
    console.error("Failed to delete recipe:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};
