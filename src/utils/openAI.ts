const BASE_URL = "https://sonar-lab-server-8881cb834ac4.herokuapp.com";


async function getOpenAIResponse(data: string, prompt: string) {
  const systemPrompt = `
    You are an analytics expert. Based on the data provided, generate insights or answer the user's question.
    Data format: ${data}
  `;

  const res = await fetch(`${BASE_URL}/api/openai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ OpenAI request failed:", res.status, err);
    throw new Error("OpenAI response failed");
  }

  const json = await res.json();
  return json.response;
}

export default getOpenAIResponse;
