import { getMealPlansByDate } from "../repositories/meal-plan-repository.mjs";

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

    const mealPlans = await getMealPlansByDate(date);

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
