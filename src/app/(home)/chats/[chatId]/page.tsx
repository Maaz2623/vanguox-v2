import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatList } from "@/modules/home/ui/components/chat-list";
import { ChatView } from "@/modules/home/ui/views/chat-view";
import React from "react";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async ({ params }: Props) => {
  const { chatId } = await params;

  return (
    <div className="flex flex-col h-ful flex-1">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-col flex-1"
      >
        <ResizablePanel defaultSize={20} maxSize={30} minSize={15}>
          <div className="h-full bg-sidebar rounded-lg">
            <ChatList />
          </div>
        </ResizablePanel>
        <div className="flex flex-col justify-center items-center">
          <ResizableHandle className="mx-10 h-[80%]" withHandle />
        </div>
        <ResizablePanel className="" defaultSize={80} minSize={70}>
          <ChatView chatId={chatId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ChatIdPage;
