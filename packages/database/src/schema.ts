import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accounts table for OAuth providers
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

// Conversations are containers for graph structures
export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  activeLeafId: text("active_leaf_id"),
});

// Messages are nodes in the conversation graph
export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").references(() => conversations.id, {
      onDelete: "cascade",
    }),

    // Graph structure
    parentId: text("parent_id"),
    mergeParentIds: text("merge_parent_ids").array(),

    // Message content
    type: text("type").notNull(), // 'human', 'ai', 'tool', 'system'
    content: text("content"),
    toolCalls: jsonb("tool_calls"),
    toolResult: jsonb("tool_result"),

    // LangGraph specific
    nodeName: text("node_name"),
    step: integer("step"),
    checkpoint: jsonb("checkpoint"),

    // Metadata for ordering and display
    branchIndex: integer("branch_index").default(0),
    depth: integer("depth").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    conversationIdx: index("conversation_idx").on(table.conversationId),
    parentIdx: index("parent_idx").on(table.parentId),
    conversationDepthIdx: index("conversation_depth_idx").on(
      table.conversationId,
      table.depth
    ),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
    parentRef: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete("cascade"),
  })
);

// Edges explicitly define relationships
export const edges = pgTable(
  "edges",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").references(() => conversations.id, {
      onDelete: "cascade",
    }),
    sourceId: text("source_id").references(() => messages.id, {
      onDelete: "cascade",
    }),
    targetId: text("target_id").references(() => messages.id, {
      onDelete: "cascade",
    }),
    type: text("type"), // 'default', 'retry', 'branch', 'merge'
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    conversationIdx: index("edges_conversation_idx").on(table.conversationId),
    sourceIdx: index("edges_source_idx").on(table.sourceId),
    targetIdx: index("edges_target_idx").on(table.targetId),
  })
);

// Conversation snapshots for rewind functionality
export const snapshots = pgTable(
  "snapshots",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").references(() => conversations.id, {
      onDelete: "cascade",
    }),
    messageId: text("message_id").references(() => messages.id, {
      onDelete: "cascade",
    }),
    snapshot: jsonb("snapshot"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    conversationIdx: index("snapshots_conversation_idx").on(
      table.conversationId
    ),
    messageIdx: index("snapshots_message_idx").on(table.messageId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  conversations: many(conversations),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    messages: many(messages),
    edges: many(edges),
    snapshots: many(snapshots),
  })
);

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
  }),
  children: many(messages),
}));

export const edgesRelations = relations(edges, ({ one }) => ({
  conversation: one(conversations, {
    fields: [edges.conversationId],
    references: [conversations.id],
  }),
  source: one(messages, {
    fields: [edges.sourceId],
    references: [messages.id],
  }),
  target: one(messages, {
    fields: [edges.targetId],
    references: [messages.id],
  }),
}));

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  conversation: one(conversations, {
    fields: [snapshots.conversationId],
    references: [conversations.id],
  }),
  message: one(messages, {
    fields: [snapshots.messageId],
    references: [messages.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Edge = typeof edges.$inferSelect;
export type NewEdge = typeof edges.$inferInsert;

export type Snapshot = typeof snapshots.$inferSelect;
export type NewSnapshot = typeof snapshots.$inferInsert;
