// Simple helper to call Google AI Studio generative language endpoint.
// NOTE: Requires the environment variable NEXT_PUBLIC_GOOGLE_AI_STUDIO_API_KEY
// For secure usage in production move the key to a server-side env variable without NEXT_PUBLIC.

const GOOGLE_AI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage";

export interface AIMessage {
  role: "user" | "model";
  content: string;
}

export async function generateAIResponse(messages: AIMessage[]): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_AI_STUDIO_API_KEY) {
    throw new Error("Google AI Studio API key is not set");
  }

  const res = await fetch(
    `${GOOGLE_AI_ENDPOINT}?key=${process.env.NEXT_PUBLIC_GOOGLE_AI_STUDIO_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          messages: messages.map((m) => ({ content: m.content, author: m.role }))
        },
        temperature: 0.7,
        candidateCount: 1,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`AI request failed: ${error}`);
  }

  const json = await res.json();
  return json.candidates?.[0]?.content || "(no response)";
}
