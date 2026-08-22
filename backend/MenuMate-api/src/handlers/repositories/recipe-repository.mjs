import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "../../lib/dynamodb.mjs";

const tableName = process.env.RECIPES_TABLE_NAME;

export async function getRecipes() {
  const comand = new ScanCommand({
    TableName: tableName,
  });

  const result = await dynamoDb.send(comand);
  return result.Items ?? [];
}

export async function getRecipeById(recipeId) {
  const command = new GetCommand({
    TableName: tableName,
    Key: {
      recipeId,
    },
  });

  const result = await dynamoDb.send(command);

  return result.Item ?? null;
}
