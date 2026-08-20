import { QueryCommand } from "@aws-sdk/lib-dynamodb";
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
