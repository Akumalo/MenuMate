import { upsertMealPlan } from "../repositories/meal-plan-repository.mjs";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body ?? "{}");

    const { mealDate, mealType, recipeId } = body;

    if (!mealDate || !mealType || !recipeId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "mealDate, mealType, and recipeId are required",
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

    // TODO: 認証実装後はログインユーザーのuserIdを取得する
    const userId = "user-001";

    const mealPlan = await upsertMealPlan({
      userId,
      mealDate,
      mealType,
      recipeId,
    });

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
