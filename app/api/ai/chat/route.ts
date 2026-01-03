import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for GrowzzyOS, a marketing automation platform. 
          Your role is to assist users with their marketing campaigns, ad creatives, and analytics.
          Be concise, professional, and helpful. If you don't know something, say so.
          Format your responses in clear, readable markdown.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    
    return NextResponse.json({ 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
