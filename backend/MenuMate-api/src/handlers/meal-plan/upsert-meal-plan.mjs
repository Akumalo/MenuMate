import { upsertMealPlan } from "../repositories/meal-plan-repository.mjs";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body ?? "{}");

    const { date, mealType, recipeId } = body;

    if (!date || !mealType || !recipeId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "date, mealType, and recipeId are required",
        }),
      };
    }

    if (!["breakfast", "lunch", "dinner"].includes(mealType)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "mealType must be breakfast, lunch, or dinner",
        }),
      };
    }

    const mealPlan = await upsertMealPlan({ date, mealType, recipeId });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...mealPlan,
        message: "Meal plan saved successfully.",
      }),
    };
  } catch (error) {
    console.error("Failed to upsert meal plan", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal Server Error.",
      }),
    };
  }
};
