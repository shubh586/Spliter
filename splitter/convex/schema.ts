import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// @snippet start schema
export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]).index("by_email",["email"]).searchIndex("search_name", {searchField:"name"}).searchIndex("seaarch_email", {searchField:"email"}),
});
