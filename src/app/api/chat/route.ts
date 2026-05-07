import { streamText, convertToModelMessages, createUIMessageStreamResponse, type UIMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { fetchEmployees } from '@/lib/supabase';
import { SEED_EMPLOYEES } from '@/lib/seed-data';
import { buildSystemPrompt } from '@/lib/ai-context';

export const maxDuration = 60;

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  headers: {
    'HTTP-Referer': 'https://qriyah-swilah-salary-report.vercel.app',
    'X-Title': 'Qriyah Swilah Salary System',
  },
});

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response('خدمة الذكاء الاصطناعي غير مُهيأة. يرجى التحقق من مفتاح API.', { status: 500 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  let employees;
  if (supabaseConfigured) {
    try {
      employees = await fetchEmployees();
    } catch {
      employees = SEED_EMPLOYEES;
    }
  } else {
    employees = SEED_EMPLOYEES;
  }

  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: openrouter.chat('anthropic/claude-opus-4-6'),
    system: buildSystemPrompt(employees),
    messages: modelMessages,
    maxOutputTokens: 4096,
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
