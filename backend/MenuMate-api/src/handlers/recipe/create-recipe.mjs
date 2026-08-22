import { createRecipe } from "../repositories/recipe-repository.mjs";

export const handler = async (event) => {
  try {
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

    const { recipeId, name, description, isFavorite = false } = body;

    if (!recipeId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "recipeId is required" }),
      };
    }

    if (!name) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "name is required" }),
      };
    }

    const recipe = {
      recipeId,
      name,
      description: description ?? null,
      isFavorite,
    };

    const createdRecipe = await createRecipe(recipe);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createdRecipe),
    };
  } catch (error) {
    console.error("Failed to create recipe:", error);

    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Recipe already exists" }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
