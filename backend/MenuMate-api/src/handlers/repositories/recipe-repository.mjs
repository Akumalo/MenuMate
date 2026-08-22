import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
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

export async function createRecipe(recipe) {
  const command = new PutCommand({
    TableName: tableName,
    Item: recipe,
    ConditionExpression: "attribute_not_exists(recipeId)",
  });

  await dynamoDb.send(command);

  return recipe;
}

export async function updateRecipe(recipeId, recipe) {
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  if (recipe.name !== undefined) {
    updateExpressions.push("#name = :name");
    expressionAttributeNames["#name"] = "name";
    expressionAttributeValues[":name"] = recipe.name;
  }

  if (recipe.description !== undefined) {
    updateExpressions.push("#description = :description");
    expressionAttributeNames["#description"] = "description";
    expressionAttributeValues[":description"] = recipe.description;
  }

  if (recipe.isFavorite !== undefined) {
    updateExpressions.push("#isFavorite = :isFavorite");
    expressionAttributeNames["#isFavorite"] = "isFavorite";
    expressionAttributeValues[":isFavorite"] = recipe.isFavorite;
  }

  if (updateExpressions.length === 0) {
    // No fields to update
    return null;
  }

  const params = {
    TableName: tableName,
    Key: { recipeId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ConditionExpression: "attribute_exists(recipeId)",
    ReturnValues: "ALL_NEW",
  };

  if (Object.keys(expressionAttributeNames).length > 0) {
    params.ExpressionAttributeNames = expressionAttributeNames;
  }

  if (Object.keys(expressionAttributeValues).length > 0) {
    params.ExpressionAttributeValues = expressionAttributeValues;
  }

  const command = new UpdateCommand(params);

  try {
    const result = await dynamoDb.send(command);

    return result.Attributes ?? null;
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return null;
    }

    throw error;
  }
}
