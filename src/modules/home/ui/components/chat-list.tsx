"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { MessagesListLoading } from "@/modules/messages/ui/components/messages-list-loading";

interface Props {
  userId: string;
}

export const ChatList = ({ userId }: Props) => {
  const chats = useQuery(api.messages.listThreads, {
    userId,
  });

  const router = useRouter();

  if (!chats) return <MessagesListLoading />;

  const formattedList = chats.page.map((chat) => ({
    title: chat.title,
    id: chat._id,
  }));

  return (
    <div className="border flex flex-col flex-1 rounded-xl py-4 px-2">
      <div className="border flex flex-col gap-y-4">
        <div className="border">
          <Button className="w-full" onClick={() => router.push(`/`)}>
            <PlusIcon />
            New
          </Button>
        </div>

        <div className="flex flex-col gap-y-2 flex-1">
          <span className="text-xs text-muted-foreground mb-2">
            Chat History
          </span>
          <div className="flex flex-col overflow-y-auto max-h-[423px] scrollbar-thin">
            <div className="h-full flex flex-col w-full pr-2 gap-y-1">
              {formattedList.map((chat, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  onClick={() => router.push(`/chats/${chat.id}`)}
                  className="justify-start hover:bg-accent text-sm w-full text-muted-foreground rounded-[8px] overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  <p className="truncate max-w-[98%]">{chat.title}</p>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
