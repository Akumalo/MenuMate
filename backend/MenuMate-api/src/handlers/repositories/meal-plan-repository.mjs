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

export async function getMealPlansByDate(date) {
  console.log("Query date:", date);
  console.log("Table:", tableName);

  const command = new QueryCommand({
    TableName: tableName,
    IndexName: "date-index",
    KeyConditionExpression: "#date = :date",
    ExpressionAttributeNames: {
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":date": date,
    },
  });

  const result = await dynamoDb.send(command);

  console.log("Query result:", JSON.stringify(result));

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

export async function upsertMealPlan({ date, mealType, recipeId }) {
  const mealPlanId = `${date}-${mealType}`;

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      mealPlanId,
      date,
      mealType,
      recipeId,
    },
  });

  await dynamoDb.send(command);

  return {
    mealPlanId,
    date,
    mealType,
    recipeId,
  };
}
