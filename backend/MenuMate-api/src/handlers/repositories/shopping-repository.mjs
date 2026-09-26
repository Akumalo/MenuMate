import {
  QueryCommand,
  GetCommand,
  UpdateCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../lib/dynamodb.mjs";

const tableName = process.env.SHOPPING_LISTS_TABLE_NAME;

export async function getShoppingListsByUser(userId) {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: "UserIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const result = await dynamoDb.send(command);

  return result.Items ?? [];
}

export async function getShoppingListById(shoppingId) {
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      shoppingId,
    },
  });

  const result = await dynamoDb.send(command);

  return result.Item ?? null;
}

export async function updateShoppingItem(shoppingId, shoppingItemId, checked) {
  const shoppingList = await getShoppingListById(shoppingId);

  if (!shoppingList) {
    return null;
  }

  const items = shoppingList.items ?? [];

  const itemIndex = items.findIndex(
    (item) => item.shoppingItemId === shoppingItemId,
  );

  if (itemIndex === -1) {
    return undefined;
  }

  items[itemIndex] = {
    ...items[itemIndex],
    checked,
  };

  const command = new UpdateCommand({
    TableName: tableName,
    Key: {
      shoppingId,
    },
    UpdateExpression: "SET #items = :items",
    ExpressionAttributeNames: {
      "#items": "items",
    },
    ExpressionAttributeValues: {
      ":items": items,
    },
    ReturnValues: "ALL_NEW",
  });

  const result = await dynamoDb.send(command);

  return result.Attributes;
}

export async function saveShoppingList(shoppingList) {
  const command = new PutCommand({
    TableName: tableName,
    Item: shoppingList,
  });

  await dynamoDb.send(command);
  return shoppingList;
}
