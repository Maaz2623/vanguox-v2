import {Agent} from '@convex-dev/agent'
import { components } from './_generated/api'
import {openai} from '@ai-sdk/openai'
import { action } from './_generated/server'
import { v } from 'convex/values'


export const supportAgent = new Agent(components.agent, {
    chat: openai("gpt-4o"),
    textEmbedding: openai.embedding("text-embedding-3-small"),
    instructions: "You are a helpful assistant"
})


export const createThread = action({
    args: {
        prompt: v.string(),
    },
        handler: async (ctx, args) => {
            const {threadId, thread} = await supportAgent.createThread(ctx, {})

            const result = await thread.generateText({
                prompt: args.prompt
            })

            return {
                threadId,
                text: result.text
            }


        }
})