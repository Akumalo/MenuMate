export const handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: "2026-08-09",
      meals: {
        breakfast: {},
        lunch: {},
        dinner: {},
      },
      shopping: {
        uncheckedCount: 5,
      },
    }),
  };
};
