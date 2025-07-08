import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
// import { Typewriter } from "react-simple-typewriter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { ReactNode } from "react";
import "highlight.js/styles/atom-one-dark.css"; // or any other theme like atom-one-dark

interface MessagesCardProps {
  role: "user" | "assistant" | "tool" | "system" | undefined;
  content: string;
  isTypewriter?: boolean;
}

export const MessagesCard = ({
  role,
  content,
  isTypewriter = false,
}: MessagesCardProps) => {
  if (role === "user") {
    return <UserMessage content={content} />;
  } else {
    return <AssistantMessage content={content} isTypewriter={isTypewriter} />;
  }
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="w-full flex justify-end text-[16px]">
      <Card className="shadow-none w-fit max-w-[60%] p-4 bg-[#3e4bbb] text-white border-none">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({
  content,
  // isTypewriter,
}: {
  content: string;
  isTypewriter?: boolean;
}) => {
  const markdown = content;

  return (
    <div
      className={cn("flex flex-col group px-2 pb-4 max-w-[70%] text-[16px]")}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src={`/logo.svg`}
          alt="vibe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vanguox</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 font-medium">
          {format(Date.now(), "HH:mm 'on' MM dd, yyyy")}
        </span>
      </div>

      <div className="w-full flex justify-start flex-col gap-y-2">
        <Card className="shadow-none bg-sidebar w-fit p-5 border-none animate-fade-in max-w-[600px]">
          {/* {isTypewriter ? (
            <Typewriter typeSpeed={10} words={[content]} />
          ) : ( */}
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h1: (props) => (
                <h1 className="text-2xl font-bold mb-2" {...props} />
              ),
              h2: (props) => (
                <h2 className="text-xl font-semibold mb-2" {...props} />
              ),
              h3: (props) => (
                <h3 className="text-lg font-semibold mb-2" {...props} />
              ),
              ul: (props) => (
                <ul className="list-disc pl-6 space-y-1" {...props} />
              ),
              ol: (props) => (
                <ol className="list-decimal pl-6 space-y-1" {...props} />
              ),
              li: (props) => <li className="ml-1" {...props} />,
              p: (props) => <p className="mb-2 leading-6" {...props} />,
              strong: (props) => (
                <strong className="font-semibold" {...props} />
              ),
              code: ({
                inline,
                className,
                children,
                ...props
              }: {
                inline?: boolean;
                className?: string;
                children?: ReactNode;
              }) => {
                if (inline) {
                  // ✅ Inline code: allowed inside <p>, small styled span
                  return (
                    <code
                      className="bg-muted px-1 py-[2px] rounded text-sm font-mono text-foreground"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                // ✅ Block code: not allowed inside <p>, wrap with a div
                return (
                  <div className="my-4">
                    <pre className="bg-black/30 text-white px-4 py-4 overflow-x-auto text-sm rounded-md">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {markdown}
          </Markdown>
          {/* )} */}
        </Card>
      </div>
    </div>
  );
};
