import { getMealPlansByUserAndDate } from "../repositories/meal-plan-repository.mjs";

export const handler = async (event) => {
  try {
    console.log("event:", JSON.stringify(event));

    const date = event.queryStringParameters?.date;
    console.log("date:", date);

    if (!date) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "date is required",
        }),
      };
    }

    // TODO: 認証実装後はログインユーザーのuserIdを取得する
    const userId = "user-001";

    const mealPlans = await getMealPlansByUserAndDate(userId, date);

    console.log("mealPlans:", JSON.stringify(mealPlans));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealPlans),
    };
  } catch (error) {
    console.error("Failed to get meal plans", error);

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
