import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  return (
    <div className="h-screen overflow-hidden">
      <ChatInterface chatId={chatId} />
    </div>
  );
}
