import { v } from "convex/values";
import {
  action,
  internalAction,
  mutation,
  query,
} from "./_generated/server";
import { Agent, Thread } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { google } from "@ai-sdk/google";
import { ToolSet } from "ai";
import { paginationOptsValidator } from "convex/server";

export const agent = new Agent(components.agent, {
  chat: google("gemini-1.5-pro"),
  textEmbedding: google.textEmbeddingModel("text-embedding-004"),
  instructions: "You are a helpful assistant",
});

// ✅ Query: List messages and create thread if needed
export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const paginated = await agent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});


// ✅ Action: Generate AI response
export const generateAndRespond = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const { messageId: userMessageId } = await agent.saveMessage(ctx, {
      threadId: args.threadId,
      prompt: args.prompt,
      skipEmbeddings: true,
    });

    const { thread } = await agent.continueThread(ctx, {
      threadId: args.threadId,
    });

    await thread.generateText({ promptMessageId: userMessageId });

    const result = await agent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: { numItems: 1, cursor: null },
    });

    const assistantMessage = result.page.find(
      (msg) => msg.message?.role === "assistant"
    );

    return {
      assistantMessageId: assistantMessage?._id,
    };
  },
});

// ✅ Mutation: Create thread manually
export const createNewThread = mutation({
  args: { title: v.optional(v.string()), prompt: v.string() },
  handler: async (ctx, { title }) => {
    const { threadId } = await agent.createThread(ctx, { title });
    // await agent.saveMessage(ctx, {
    //   threadId,
    //   message: {
    //     role: "user",
    //     content: prompt,
    //   },
    // });
    return threadId;
  },
});

// ✅ Background generation
export const generateResponse = internalAction({
  args: { promptMessageId: v.string(), threadId: v.string() },
  handler: async (ctx, { promptMessageId, threadId }) => {
    const { thread } = await agent.continueThread(ctx, { threadId });
    await thread.generateText({ promptMessageId });

    await maybeUpdateThreadTitle(thread);
  },
});

// ✅ Utility: Update title
async function maybeUpdateThreadTitle(thread: Thread<ToolSet>) {
  const existingTitle = (await thread.getMetadata()).title;
  if (!existingTitle || existingTitle.endsWith(" thread")) {
    const { text } = await thread.generateText(
      { prompt: "Generate a title for this thread." },
      { storageOptions: { saveMessages: "none" } },
    );
    await thread.updateMetadata({ title: text });
  }
}
