import ChatPage from '@/components/chat/ChatPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المستشار الذكي — شركة قرية صويلح',
  description: 'مستشار أعمال ذكي لتحليل بيانات الرواتب والموظفين',
};

export default function ChatRoute() {
  return <ChatPage />;
}
