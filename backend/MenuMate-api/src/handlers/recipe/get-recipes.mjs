import { getRecipes } from "../repositories/recipe-repository.mjs";

export const handler = async (event) => {
  try {
    const recipes = await getRecipes();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipes),
    };
  } catch (error) {
    console.error("Failed to get recipes:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
