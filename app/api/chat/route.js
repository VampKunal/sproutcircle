import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
  
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();

    
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',

      messages,
    });

    const content = completion.choices?.[0]?.message?.content ?? 'No response.';

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('API error:', err);

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
