import { streamText, convertToModelMessages, type UIMessage } from 'ai';
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
    'X-Title': 'نظام إدارة المرتبات - شركة قرية صويلح',
  },
});

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: 'خدمة الذكاء الاصطناعي غير مُهيأة. يرجى التحقق من مفتاح API.' },
      { status: 500 }
    );
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

  try {
    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: openrouter('anthropic/claude-opus-4-6'),
      system: buildSystemPrompt(employees),
      messages: modelMessages,
      maxOutputTokens: 4096,
    });

    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 429) {
      return Response.json(
        { error: 'تم تجاوز الحد المسموح. حاول مجدداً بعد قليل.' },
        { status: 429 }
      );
    }
    return Response.json(
      { error: 'حدث خطأ أثناء المعالجة. حاول مجدداً.' },
      { status: 500 }
    );
  }
}
