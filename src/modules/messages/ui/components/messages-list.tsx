import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { useThreadMessages } from "@convex-dev/agent/react";
import { api } from "../../../../../convex/_generated/api";
import { MessageLoading } from "./message-loading";
import { MessagesCard } from "./message-card";

export const MessagesList = ({
  freshAssistantId,
  chatId,
}: {
  freshAssistantId: string | null;
  chatId: string;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const messages = useThreadMessages(
    api.messages.listThreadMessages,
    {
      threadId: chatId,
    },
    {
      initialNumItems: 10,
    }
  );

  const formattedMessages = messages.results.map((message) => ({
    role: message.message?.role,
    status: message.status,
    content: message.message?.content,
    id: message._id,
  }));
  const lastMessage = formattedMessages[formattedMessages.length - 1];
  const isLastMessageUser = lastMessage?.role === "user";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const lastMessage = formattedMessages[formattedMessages.length - 1];

    if (lastMessage && lastMessage.id !== lastMessageIdRef.current) {
      // New message detected
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      lastMessageIdRef.current = lastMessage.id;
    }
  }, [formattedMessages.length, formattedMessages]);

  return (
    <ScrollArea className="h-[405px] overflow-y-auto pr-8 flex flex-col">
      <div className="flex flex-col gap-y-4">
        {formattedMessages.map((message) => {
          if (lastMessage.role === "assistant") {
            console.log(freshAssistantId, lastMessage.id);
          }
          return (
            <MessagesCard
              key={message.id}
              role={message.role}
              content={
                typeof message.content === "string"
                  ? message.content
                  : Array.isArray(message.content)
                    ? message.content
                        .filter((part) => part.type === "text")
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //   @ts-ignore
                        .map((part) => part.text)
                        .join(" ")
                    : ""
              }
              isTypewriter={message.id === freshAssistantId}
            />
          );
        })}
        {isLastMessageUser && <MessageLoading />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
