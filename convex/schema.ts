import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    messages: defineTable({
        id: v.string(),
        chatId: v.string(),
        content: v.optional(v.string()),
        role: v.union(v.literal("USER"), v.literal("ASSISTANT"))
    })
})