import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, code, language } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create the system prompt for code analysis
    const systemPrompt = `You are an expert code analyst and programming mentor. Your role is to:

1. Analyze code for potential improvements
2. Suggest optimizations for performance, readability, and maintainability
3. Explain complex concepts in simple terms
4. Identify potential bugs or edge cases
5. Recommend best practices and design patterns
6. Help developers understand why certain approaches are better

When analyzing code:
- Be constructive and encouraging
- Provide specific, actionable suggestions
- Explain the reasoning behind your recommendations
- Consider different skill levels and adapt your explanations accordingly
- Focus on both correctness and code quality
- Use bullet points and clear formatting for better readability
- Break down complex explanations into digestible parts
- When suggesting code improvements, show before/after examples when helpful

Format your responses with:
• Clear bullet points for lists
• Line breaks between different topics
• Code snippets in backticks when referring to specific code elements
• Structured sections when appropriate

Current context:
- Programming Language: ${language || 'Unknown'}
- Code being analyzed: ${code ? 'Available' : 'Not provided'}

Be helpful, concise, and educational in your responses. Make your explanations easy to scan and understand.`;

    const userPrompt = code 
      ? `Here's my ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nQuestion: ${message}`
      : message;

    console.log('🤖 Sending request to OpenAI...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can change this to "gpt-3.5-turbo" for faster/cheaper responses
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('✨ OpenAI response received');

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'AI chat failed',
        success: false 
      },
      { status: 500 }
    );
  }
}
