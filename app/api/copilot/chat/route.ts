import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      console.log('OpenAI API key not configured, using fallback responses');
      
      // Generate fallback response based on user input
      const userMessage = messages[messages.length - 1]?.content || '';
      const fallbackResponse = generateFallbackResponse(userMessage, context?.campaigns);
      
      return NextResponse.json({ response: fallbackResponse });
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
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
    const aiResponse = data.choices?.[0]?.message?.content || 'I could not generate a response. Please try again.';

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

function generateFallbackResponse(userMessage: string, campaigns?: any[]): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Provide contextual responses based on keywords
  if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
    return `Based on your campaigns, here are some optimization recommendations:

1. **ROAS Optimization**: Focus on campaigns with ROAS below 2.5x - consider pausing or reallocating budget
2. **Creative Refresh**: Update ad creatives that are older than 7-10 days to maintain engagement
3. **Budget Allocation**: Shift 20% of budget from underperforming to top-performing campaigns
4. **Targeting Refinement**: Review audience targeting and exclude non-converting segments

Would you like me to analyze specific campaigns for detailed recommendations?`;
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('spend')) {
    return `For budget optimization, I recommend:

• **Daily Budget**: Start with ₹500-1000 per campaign for testing
• **Scale Strategy**: Increase budget by 20% weekly when ROAS > 3.0x
• **Reallocation**: Move budget from campaigns with ROAS < 1.5x to better performers
• **Seasonal Adjustments**: Increase budget during peak shopping seasons

Current campaigns show varied performance. Would you like specific budget recommendations?`;
  }
  
  if (lowerMessage.includes('roas') || lowerMessage.includes('return')) {
    return `ROAS improvement strategies:

1. **Product Focus**: Prioritize products with highest margins
2. **Audience Testing**: Test new interest-based audiences weekly
3. **Ad Copy**: A/B test headlines and descriptions
4. **Landing Pages**: Ensure fast loading and mobile optimization
5. **Retargeting**: Implement cart abandonment campaigns

Your current blended ROAS is around 2.8x. There's room for improvement to reach 3.5-4.0x range.`;
  }
  
  return `I'm here to help with your marketing campaigns! I can assist with:

• Campaign optimization and ROAS improvement
• Budget allocation and scaling strategies  
• Creative performance analysis
• Audience targeting recommendations
• A/B testing strategies
• Performance reporting insights

What specific aspect of your campaigns would you like to discuss?`;
}
