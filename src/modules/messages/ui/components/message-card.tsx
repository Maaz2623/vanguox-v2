import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
// import { Typewriter } from "react-simple-typewriter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
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
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props) => (
                <h2 className="text-xl font-semibold my-4" {...props} />
              ),
              h3: (props) => (
                <h3 className="text-lg font-semibold mb-2" {...props} />
              ),
              ul: (props) => (
                <ul className="list-disc pl-6 space-y-1 mb-8" {...props} />
              ),
              ol: (props) => (
                <ol
                  className="list-decimal pl-6 mb-2 [&>li]:mb-1 [&>li>ol]:list-[lower-alpha] [&>li>ol]:pl-6 [&>li>ol>li>ol]:list-[lower-roman] [&>li>ol>li>ol]:pl-6"
                  {...props}
                />
              ),
              li: (props) => <li className="ml-1" {...props} />,

              p: (props) => <p className="mb-4 leading-6" {...props} />,
              strong: (props) => (
                <strong className="font-semibold" {...props} />
              ),
              code: ({ className, children, ...props }) => {
                const isBlock = className?.includes("language-"); // <--- detect block code

                if (isBlock) {
                  return (
                    <pre className="px-4 scrollbar-thin mx-auto py-2 my-4 bg-black/30 overflow-x-auto text-sm rounded-md">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                }

                // Inline code (rendered inside <p>)
                return (
                  <code className="bg-muted px-1 py-0.5 mx-auto rounded text-[14px] font-mono">
                    {children}
                  </code>
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
