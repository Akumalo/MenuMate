import { getShoppingListsByUser } from "../repositories/shopping-repository.mjs";

export const handler = async (event) => {
  try {
    console.log("event:", JSON.stringify(event));

    //TODO:認証実装後はログインユーザのuserIdを取得する
    const userId = "user-001";

    const shoppingLists = await getShoppingListsByUser(userId);

    console.log("shoppingLists:", JSON.stringify(shoppingLists));

    const items = shoppingLists.flatMap((shoppingList) => {
      return shoppingList.items ?? [];
    });

    const totalCount = items.length;

    const uncheckedCount = items.filter(
      (item) => item.checked === false,
    ).length;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalCount,
        uncheckedCount,
        items,
      }),
    };
  } catch (error) {
    console.error("Failed to get shopping list", error);

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
