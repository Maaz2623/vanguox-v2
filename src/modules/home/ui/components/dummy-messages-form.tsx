import { useForm } from "react-hook-form";
import TextAreaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  value: z
    .string()
    .min(1, {
      message: "Prompt is required",
    })
    .max(150, {
      message: "Prompt is too long",
    }),
});

export const DummyMessagesForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createThread = useMutation(api.messages.createNewThread);

  const sendMessage = useAction(api.messages.generateAndRespond);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      createThread({
        title: "Untitled",
        prompt: values.value,
      }).then((threadId) => {
        router.push(`/chats/${threadId}`);
        sendMessage({
          threadId: threadId,
          prompt: values.value,
        });
      });

      form.reset();
    } catch (err) {
      console.error("Failed to send event:", err);
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isDisabled = !form.formState.isValid;

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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              placeholder="What would you like to build?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
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
            <ArrowUpIcon />
          </Button>
        </div>
      </form>
    </Form>
  );
};
