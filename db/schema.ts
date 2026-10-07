import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  credits:integer("credits").default(5),
});

export const AgentConfig = pgTable("agent_config", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  agentImage: text("agent_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userEmail: text("user_email").notNull().references(() => users.email),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AgentConfig = typeof AgentConfig.$inferSelect;
export type NewAgentConfig = typeof AgentConfig.$inferInsert;
