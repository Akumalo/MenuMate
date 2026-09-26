import { deleteMealPlan } from "../repositories/meal-plan-repository.mjs";

export const handler = async (event) => {
  try {
    const mealPlanId = event.pathParameters?.mealPlanId;

    if (!mealPlanId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "mealPlanId is requred",
        }),
      };
    }

    await deleteMealPlan(mealPlanId);

    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    };
  } catch (error) {
    console.error("Failed to delete meal plan", error);

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
