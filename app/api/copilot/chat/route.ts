import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_STUDIO_API_KEY?.trim();
    if (!apiKey) {
      console.error('Google AI Studio API key not configured');
      return NextResponse.json(
        { 
          error: 'AI service not configured',
          details: 'Missing or invalid API key. Please check your .env.local file.'
        },
        { status: 500 }
      );
    }

    // Build system prompt with marketing context
    const systemPrompt = `You are an AI Marketing Co-Pilot for GROWZZY OS, an AI-powered marketing operations platform for Indian DTC founders and agencies. 

You have access to the following campaign data:
${context?.campaigns ? JSON.stringify(context.campaigns, null, 2) : 'No campaign data available'}

Your role is to:
1. Analyze campaign performance and identify optimization opportunities
2. Provide specific, actionable recommendations with metrics
3. Explain why certain campaigns are underperforming
4. Suggest budget reallocation strategies
5. Recommend creative refreshes based on ad age and engagement
6. Help with ROAS optimization and scaling strategies

Always respond in a conversational, helpful tone. Use Indian Rupee (₹) for currency. Provide specific numbers and percentages when possible.`;

    // Call OpenAI Chat Completion API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 },
          temperature: 0.7,
          max_tokens: 512,
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser: ${messages[messages.length - 1]?.content}` }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google AI API error:', errorData);
      
      // Return detailed error for debugging
      return NextResponse.json(
        {
          error: 'AI service error',
          details: `API request failed with status ${response.status}: ${errorData}`,
          response: `I'm having trouble connecting to the AI service right now. However, based on your question about your campaigns, here's what I can suggest:\n\n1. Check your campaign ROAS - if it's below 2.5x, consider pausing or optimizing\n2. Review ad creative age - refresh ads older than 7 days\n3. Reallocate budget from low-performing to high-performing campaigns\n\nError details: ${response.status} - ${errorData}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not generate a response. Please try again.';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process your request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
