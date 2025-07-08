"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { MessagesListLoading } from "@/modules/messages/ui/components/messages-list-loading";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@/components/user-button";

interface Props {
  userId: string;
}

export const ChatList = ({ userId }: Props) => {
  const { data } = authClient.useSession();
  const chats = useQuery(api.messages.listThreads, { userId });
  const router = useRouter();

  if (!chats) return <MessagesListLoading />;

  const formattedList = chats.page.map((chat) => ({
    title: chat.title,
    id: chat._id,
  }));

  return (
    <div className="flex flex-col h-full border rounded-xl p-4">
      {/* Top - New Button */}
      <Button className="w-full mb-4" onClick={() => router.push(`/`)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        New
      </Button>

      {/* Middle - Chat History */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-2">
            Chat History
          </span>

          <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
            <div className="flex flex-col gap-y-1">
              {formattedList.map((chat, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  onClick={() => router.push(`/chats/${chat.id}`)}
                  className="justify-start text-sm text-muted-foreground rounded-md overflow-hidden"
                >
                  <p className="truncate max-w-full">{chat.title}</p>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom - User Button */}
        {data && (
          <div className="pt-4 border-t mt-4">
            <UserButton
              name={data.user.name}
              image={data.user.image}
              email={data.user.email}
            />
          </div>
        )}
      </div>
    </div>
  );
};
