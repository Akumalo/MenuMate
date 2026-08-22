import { updateRecipe } from "../repositories/recipe-repository.mjs";

export const handler = async (event) => {
  try {
    const recipeId = event.pathParameters?.recipeId;

    if (!recipeId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "reciped is required" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    let body;

    try {
      body = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Invalid JSON" }),
      };
    }

    const { name, description, isFavorite } = body;

    if (
      name === undefined &&
      description === undefined &&
      isFavorite === undefined
    ) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "At least one field is request" }),
      };
    }

    const recipe = await updateRecipe(recipeId, {
      name,
      description,
      isFavorite,
    });

    if (!recipe) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Recipe not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    };
  } catch (error) {
    console.error("Failed to update recipe:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
