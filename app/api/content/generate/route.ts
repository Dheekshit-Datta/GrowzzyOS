import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

let openai: OpenAI | null = null;

type Variant = {
  id: string;
  text: string;
  imageUrl?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { product, benefit, audience, tone } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      // Mock response for development
      const mockVariants = [
        {
          id: '1',
          text: `Experience the future with ${product}! ${benefit} Perfect for ${audience}.`,
          imageUrl: 'https://via.placeholder.com/600x400?text=Ad+Creative+1'
        },
        {
          id: '2',
          text: `Upgrade to ${product} today and ${benefit.toLowerCase()}. Designed for ${audience}.`,
          imageUrl: 'https://via.placeholder.com/600x400?text=Ad+Creative+2'
        },
        {
          id: '3',
          text: `${product}: The ultimate solution for ${audience}. ${benefit}.`,
          imageUrl: 'https://via.placeholder.com/600x400?text=Ad+Creative+3'
        },
        {
          id: '4',
          text: `Discover how ${product} can transform your life. ${benefit} Ideal for ${audience}.`,
          imageUrl: 'https://via.placeholder.com/600x400?text=Ad+Creative+4'
        },
        {
          id: '5',
          text: `Why ${audience} everywhere are choosing ${product}. ${benefit}`,
          imageUrl: 'https://via.placeholder.com/600x400?text=Ad+Creative+5'
        }
      ];
      
      return NextResponse.json({ variants: mockVariants });
    }

    // Generate text variants
    const textPrompt = `Generate 5 unique and engaging ad copy variations for a product called "${product}". 
      Key benefit: ${benefit}
      Target audience: ${audience}
      Tone: ${tone}
      
      Each variation should be 1-2 sentences, compelling, and highlight the key benefit.`;

    if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter who creates engaging and compelling ad copy.'
        },
        {
          role: 'user',
          content: textPrompt
        }
      ],
      temperature: 0.8,
      n: 5
    });

    const textVariants = completion.choices.map((choice: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      text: choice.message.content?.trim() || '',
    }));

    // Generate images for each variant
    const variantsWithImages = await Promise.all(
      textVariants.map(async (variant: any) => {
        try {
          const imagePrompt = `Create a professional, high-quality product ad image for "${product}" that shows the product in use. 
            The image should appeal to ${audience} and visually represent: ${benefit}.
            Style: Professional product photography, well-lit, high resolution, clean background.`;

          if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
          const imageResponse = await openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
          });

          return {
            ...variant,
            imageUrl: imageResponse.data[0]?.url ?? `https://via.placeholder.com/1024x1024?text=${encodeURIComponent(product)}`,
          };
        } catch (error) {
          console.error('Error generating image:', error);
          return {
            ...variant,
            imageUrl: `https://via.placeholder.com/1024x1024?text=${encodeURIComponent(product)}`,
          };
        }
      })
    );

    return NextResponse.json({ variants: variantsWithImages });
  } catch (err) {
    console.error('Content generate API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
