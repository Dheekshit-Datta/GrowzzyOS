import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, count = 3 } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate ad copies
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a marketing expert specializing in creating high-converting ad copy. 
          Generate ${count} unique ad variations based on the user's input. 
          Each ad should be 80-125 characters long, include a clear benefit and a call-to-action. 
          Format the response as a JSON array of strings.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Parse the response to extract the ads array
    const content = response.choices[0]?.message?.content || '';
    let ads: string[] = [];
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      ads = Array.isArray(parsed) ? parsed : [content];
    } catch (e) {
      // If not valid JSON, split by newlines and clean up
      ads = content
        .split('\n')
        .map(line => line.trim().replace(/^\d+\.\s*/, ''))
        .filter(line => line.length > 0);
    }

    // Generate images for each ad
    const adsWithImages = await Promise.all(ads.map(async (ad, index) => {
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Create a professional advertisement image for: ${ad}. The image should be high quality, modern, and relevant to the ad copy.`,
          n: 1,
          size: "1024x1024",
        });

        return {
          id: `ad-${Date.now()}-${index}`,
          text: ad,
          imageUrl: imageResponse.data[0]?.url || '',
        };
      } catch (error) {
        console.error(`Error generating image for ad ${index}:`, error);
        return {
          id: `ad-${Date.now()}-${index}`,
          text: ad,
          imageUrl: '',
        };
      }
    }));

    return NextResponse.json({ ads });
    
  } catch (error) {
    console.error('Error generating ads:', error);
    return NextResponse.json(
      { error: 'Failed to generate ads' },
      { status: 500 }
    );
  }
}
