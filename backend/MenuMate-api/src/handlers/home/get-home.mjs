import { getMealPlansByUserAndDate } from "../repositories/meal-plan-repository.mjs";
import { getRecipeById } from "../repositories/recipe-repository.mjs";
import { getShoppingListsByUser } from "../repositories/shopping-repository.mjs";

export const handler = async () => {
  try {
    const userId = "local-user";

    const mealDate = new Date().toISOString().slice(0, 10);

    const mealPlans = await getMealPlansByUserAndDate(userId, mealDate);

    const meals = {
      breakfast: null,
      lunch: null,
      dinner: null,
    };

    for (const mealPlan of mealPlans) {
      const recipe = await getRecipeById(mealPlan.recipeId);

      const meal = {
        mealPlanId: mealPlan.mealPlanId,
        recipeId: mealPlan.recipeId,
        title: recipe?.title ?? null,
      };

      if (mealPlan.mealType === "breakfast") {
        meals.breakfast = meal;
      }

      if (mealPlan.mealType === "lunch") {
        meals.lunch = meal;
      }

      if (mealPlan.mealType === "dinner") {
        meals.dinner = meal;
      }
    }

    const shoppingLists = await getShoppingListsByUser(userId);

    const shoppingCount = shoppingLists.reduce((count, shoppingList) => {
      return count + (shoppingList.items?.length ?? 0);
    }, 0);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealDate,
        meals,
        shopping: {
          count: shoppingCount,
        },
      }),
    };
  } catch (error) {
    console.error("GetHomeFunction error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
