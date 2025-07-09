"use client";
import { MessageForm } from "@/modules/messages/ui/components/messages-form";
import { useState } from "react";
import { MessagesList } from "@/modules/messages/ui/components/messages-list";

interface Props {
  chatId: string | "";
}

export const ChatView = ({ chatId }: Props) => {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex flex-col h-full ">
      <div className="flex flex-col flex-1 rounded-lg">
        <div className="h-full">
          <MessagesList chatId={chatId} />
        </div>
      </div>
      <div className="mx-auto w-full pr-8">
        <MessageForm
          chatId={chatId}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      </div>
    </div>
  );
};
