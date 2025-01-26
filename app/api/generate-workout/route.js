import axios from 'axios';

export async function POST(req) {
  const body = await req.json();
  const { goal } = body;

  try {
    const response = await axios.post(
      process.env.GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile", // Replace with the actual model ID
        messages: [
          { role: "system", content: "You are a fitness assistant." },
          { role: "user", content: `Create a workout plan for ${goal}.` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify({ workout: response.data.choices[0].message.content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error with Groq API:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to generate workout" }), { status: 500 });
  }
}
