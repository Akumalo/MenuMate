import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../lib/dynamodb.mjs";

const tableName = process.env.MEALPLAN_TABLE_NAME;

export async function getMealPlansByUserAndDate(userId, mealDate) {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: "UserMealDateIndex",
    KeyConditionExpression: "userId = :userId AND mealDate = :mealDate",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":mealDate": mealDate,
    },
  });

  const result = await dynamoDb.send(command);

  return result.Items ?? [];
}
