import { getMealPlansByUser } from "../repositories/meal-plan-repository.mjs";
import { getRecipeById } from "../repositories/recipe-repository.mjs";
import { saveShoppingList } from "../repositories/shopping-repository.mjs";

export const handler = async (event) => {
  try {
    console.log("event:", JSON.stringify(event));

    // TODO: 認証実装後はログインユーザーのuserIdを取得する
    const userId = "user-001";

    const mealPlans = await getMealPlansByUser(userId);

    console.log("mealPlans:", JSON.stringify(mealPlans));

    const items = [];

    for (const mealPlan of mealPlans) {
      const recipe = await getRecipeById(mealPlan.recipeId);

      if (!recipe) {
        console.warn(`Recipe not found recipeId=${mealPlan.recipeId}`);
        continue;
      }

      const ingredients = recipe.ingredients ?? [];

      for (const ingredient of ingredients) {
        items.push({
          shoppingItemId: crypto.randomUUID(),
          mealPlanId: mealPlan.mealPlanId,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          checked: false,
        });
      }
    }

    const shoppingList = {
      shoppingId: "shopping-001",
      userId,
      items,
      createdAt: new Date().toISOString(),
    };

    await saveShoppingList(shoppingList);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shoppingList),
    };
  } catch (error) {
    console.error("Failed to regenerate shopping list", error);

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
