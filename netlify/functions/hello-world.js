// A simple serverless function example
export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Hello from Erik Boxing Academy API!',
      timestamp: new Date().toISOString()
    }),
  };
} 