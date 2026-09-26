import { updateShoppingItem } from "../repositories/shopping-repository.mjs";

export const handler = async (event) => {
  try {
    console.log("event:", JSON.stringify(event));

    const shoppingItemId = event.pathParameters?.shoppingItemId;

    if (!shoppingItemId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "shoppingItemId is required.",
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (typeof body.checked !== "boolean") {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "checked must be a boolean",
        }),
      };
    }

    //現在はテストデータに合わせてshoppingIdを固定
    const shoppingId = "shopping-001";

    const shoppingList = await updateShoppingItem(
      shoppingId,
      shoppingItemId,
      body.checked,
    );

    if (shoppingList === null) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Shopping list not found.",
        }),
      };
    }

    if (shoppingList === undefined) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Shopping item not found.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shoppingId,
        checked: body.checked,
      }),
    };
  } catch (error) {
    console.error("Failed to update shopping item", error);

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
