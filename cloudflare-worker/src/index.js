import content from '../data/content.json' assert { type: 'json' };
import education from '../data/education.json' assert { type: 'json' };

export default {
  async fetch(request, env) {
    const allowList = (env.ALLOWED_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    const reqOrigin = request.headers.get('Origin') || '';
    const originAllowed = allowList.includes('*') || allowList.some((o) => o === reqOrigin);
    const allowedOrigin = originAllowed ? reqOrigin || allowList : allowList;
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      const userInput = body.input || '';

      const portfolioData = {
        my_profile_and_projects: content,
        my_education: {
          degrees: education.filter(e => e.type === 'degree'),
          certificates: education.filter(e => e.type === 'certificate'),
        }
      };

      const messages = [
        {
          role: 'system',
          content: `You are Joshua Opria running an interactive web terminal. Speak in the first person ("I", "me", "my").

Here is your profile data:
${JSON.stringify(portfolioData)}

CRITICAL FORMATTING RULES:
- You are a web-based terminal simulator. Do not use Markdown (No **, No ###, No code blocks).
- Use specific span classes to style your text. 
- ALWAYS wrap important elements using these exact tags:
  * Section Headings: <span class="term-cyan">[PROJECTS SHOWCASE]</span>
  * List numbers / Titles: <span class="term-yellow">1. STRUM</span>
  * Inline Labels / Keys: <span class="term-cyan">* Tech:</span>
  * Core Values / Tech Details: <span class="term-green">Python, PyTorch</span>

BLUEPRINT EXAMPLE (FOLLOW THIS EXACTLY):
<span class="term-cyan">[My Projects]</span>
<span class="term-yellow">1. STRUM</span> - Audio-to-chart ML pipeline.
  <span class="term-cyan">* Category:</span> <span class="term-green">AI/ML</span>
  <span class="term-cyan">* Tech:</span> <span class="term-green">Python, PyTorch</span>`
        },
        {
          role: 'user',
          content: userInput,
        },
      ];

      const aiStream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', { 
        messages: messages,
        stream: true,
        max_tokens: 1800
      });

      let buffer = '';
      const { readable, writable } = new TransformStream({
        transform(chunk, controller) {
          buffer += new TextDecoder().decode(chunk, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(line.slice(6));
                let token = parsed.response || '';
                token = token.replace(/\*\*/g, ''); // Clear random markdown bolds
                if (token) {
                  controller.enqueue(new TextEncoder().encode(token));
                }
              } catch (e) {}
            }
          }
        },
        flush(controller) {
          if (buffer.startsWith('data: ') && buffer !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(buffer.slice(6));
              let token = parsed.response || '';
              token = token.replace(/\*\*/g, '');
              if (token) {
                controller.enqueue(new TextEncoder().encode(token));
              }
            } catch (e) {}
          }
        }
      });

      aiStream.pipeTo(writable);

      return new Response(readable, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
