import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

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

export async function getMealPlansByUser(userId) {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: "UserMealDateIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const result = await dynamoDb.send(command);

  return result.Items ?? [];
}

export async function deleteMealPlan(mealPlanId) {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      mealPlanId,
    },
  });

  await dynamoDb.send(command);
}

export async function upsertMealPlan({ userId, mealDate, mealType, recipeId }) {
  const mealPlanId = `${mealDate}-${mealType}`;

  const mealPlan = {
    mealPlanId,
    userId,
    mealDate,
    mealType,
    recipeId,
    createdAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: tableName,
    Item: mealPlan,
  });

  await dynamoDb.send(command);

  return mealPlan;
}
