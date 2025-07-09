import { useForm } from "react-hook-form";
import TextAreaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { useFreshAssistantMessageId } from "@/hooks/use-fresh-assistant-message-id";

const formSchema = z.object({
  value: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export const MessageForm = ({
  isTyping,
  setIsTyping,
  chatId,
}: {
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  chatId: string | "";
}) => {
  const { setFreshAssistantMessageId } = useFreshAssistantMessageId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const sendMessage = useMutation(
    api.messages.generateAndRespond
  ).withOptimisticUpdate(
    optimisticallySendMessage(api.messages.listThreadMessages)
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("This is messages form");
    try {
      setIsTyping(true);
      setFreshAssistantMessageId(null);
      sendMessage({
        prompt: values.value,
        threadId: chatId,
      })
        .then(({ assistantMessageId }) => {
          console.log(assistantMessageId);
          setFreshAssistantMessageId(assistantMessageId as string);
        })
        .finally(() => setIsTyping(false));

      form.reset();
    } catch (err) {
      console.error("Failed to send event:", err);
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isDisabled = isTyping || !form.formState.isValid;

  return (
    <Form {...form}>
      <form
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextAreaAutosize
              {...field}
              disabled={isTyping}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={1}
              rows={1}
              maxRows={1}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              placeholder="What would you like to build?"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    // Allow newline (default behavior)
                    return;
                  } else {
                    e.preventDefault();
                    if (e.ctrlKey || !e.metaKey) {
                      form.handleSubmit(onSubmit)();
                    }
                  }
                }
              }}
            />
          )}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            disabled={isDisabled}
            className={cn(
              "size-8 rounded-full",
              isDisabled && "bg-muted-foreground border"
            )}
          >
            {isTyping ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
