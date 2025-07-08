"use client";
import { ChatList } from "../components/chat-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DummyMessagesForm } from "../components/dummy-messages-form";
import { DummyMessagesList } from "../components/dummy-messages-list";

interface Props {
  userId: string | undefined;
}

export const HomeView = ({ userId }: Props) => {
  return (
    <div className="flex flex-col h-ful flex-1">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-col flex-1"
      >
        {userId && (
          <ResizablePanel defaultSize={20} maxSize={30} minSize={15}>
            <div className="h-full bg-sidebar rounded-lg">
              {userId ? <ChatList userId={userId} /> : null}
            </div>
          </ResizablePanel>
        )}
        {userId && (
          <div className="flex flex-col justify-center items-center">
            <ResizableHandle className="mx-10 h-[80%]" withHandle />
          </div>
        )}
        <ResizablePanel className="" defaultSize={80} minSize={70}>
          <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 rounded-lg pr-8">
              <DummyMessagesList />
            </div>
            <div className="mx-auto w-full pr-8">
              <DummyMessagesForm userId={userId} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
