import { eq, desc, asc } from "drizzle-orm";
import { db } from "./db";
import { conversations, messages, edges, snapshots } from "./schema";
import { nanoid } from "nanoid";
import type {
  Message,
  Conversation,
  Edge,
  Snapshot,
  NewMessage,
  NewConversation,
  NewEdge,
  NewSnapshot,
} from "./schema";

// Conversation queries
export const getConversations = async (
  userId: string
): Promise<Conversation[]> => {
  const result = await db.query.conversations.findMany({
    where: eq(conversations.userId, userId),
    orderBy: [desc(conversations.updatedAt)],
    limit: 50,
  });
  return result as Conversation[];
};

export const getConversation = async (
  conversationId: string
): Promise<Conversation | undefined> => {
  const result = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
    with: {
      messages: {
        orderBy: [asc(messages.createdAt)],
      },
      edges: true,
    },
  });
  return result as Conversation | undefined;
};

export const createConversation = async (
  userId: string,
  title?: string
): Promise<Conversation> => {
  const result = await db
    .insert(conversations)
    .values({
      id: nanoid(),
      userId,
      title: title || "New Conversation",
    })
    .returning();
  const conversation = Array.isArray(result) ? result[0] : result;
  if (!conversation) {
    throw new Error("Failed to create conversation");
  }
  return conversation as Conversation;
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string
): Promise<void> => {
  await db
    .update(conversations)
    .set({ title, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  await db.delete(conversations).where(eq(conversations.id, conversationId));
};

// Message queries
export const getMessagePath = async (
  conversationId: string,
  leafMessageId?: string
): Promise<Message[]> => {
  // Fetch messages and edges separately
  const [messagesList, edgesList] = await Promise.all([
    db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [asc(messages.createdAt)],
    }),
    db.query.edges.findMany({
      where: eq(edges.conversationId, conversationId),
    }),
  ]);

  if (!leafMessageId) {
    const conversation = await getConversation(conversationId);
    leafMessageId = conversation?.activeLeafId ?? undefined;
  }

  if (!leafMessageId) {
    return messagesList.filter((m) => !m.parentId) as Message[];
  }

  const path: Message[] = [];
  const messageMap = new Map(messagesList.map((m) => [m.id, m]));
  const childMap = new Map<string, string[]>();

  edgesList.forEach((edge) => {
    if (edge.sourceId && edge.targetId) {
      if (!childMap.has(edge.sourceId)) {
        childMap.set(edge.sourceId, []);
      }
      childMap.get(edge.sourceId)!.push(edge.targetId);
    }
  });

  const buildPath = (messageId: string) => {
    const message = messageMap.get(messageId);
    if (!message) return;

    if (message.parentId) {
      buildPath(message.parentId);
    }
    path.push(message as Message);
  };

  buildPath(leafMessageId);
  return path;
};

export const addMessage = async (
  conversationId: string,
  type: string,
  content: string,
  parentId?: string,
  metadata?: any
): Promise<Message> => {
  const result = await db
    .insert(messages)
    .values({
      id: nanoid(),
      conversationId,
      type,
      content,
      parentId,
      ...metadata,
    })
    .returning();
  const message = Array.isArray(result) ? result[0] : result;

  // Update conversation's active leaf
  await db
    .update(conversations)
    .set({ activeLeafId: message.id, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  return message as Message;
};

export const switchBranch = async (
  conversationId: string,
  messageId: string
): Promise<void> => {
  await db
    .update(conversations)
    .set({ activeLeafId: messageId, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
};

// Edge queries
export const addEdge = async (
  conversationId: string,
  sourceId: string,
  targetId: string
): Promise<Edge> => {
  const result = await db
    .insert(edges)
    .values({
      id: nanoid(),
      conversationId,
      sourceId,
      targetId,
    })
    .returning();
  const edge = Array.isArray(result) ? result[0] : result;
  if (!edge) {
    throw new Error("Failed to create edge");
  }
  return edge as Edge;
};

// Snapshot queries
export const createSnapshot = async (
  conversationId: string,
  messageId: string,
  snapshot: any
): Promise<Snapshot> => {
  const result = await db
    .insert(snapshots)
    .values({
      id: nanoid(),
      conversationId,
      messageId,
      snapshot,
    })
    .returning();
  const snapshotResult = Array.isArray(result) ? result[0] : result;
  if (!snapshotResult) {
    throw new Error("Failed to create snapshot");
  }
  return snapshotResult as Snapshot;
};

export const getSnapshots = async (
  conversationId: string
): Promise<Snapshot[]> => {
  return await db.query.snapshots.findMany({
    where: eq(snapshots.conversationId, conversationId),
    orderBy: [desc(snapshots.createdAt)],
  });
};

// Graph traversal queries
export const getConversationGraph = async (
  conversationId: string
): Promise<{ messages: Message[]; edges: Edge[] }> => {
  const [messagesList, edgesList] = await Promise.all([
    db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [asc(messages.createdAt)],
    }),
    db.query.edges.findMany({
      where: eq(edges.conversationId, conversationId),
    }),
  ]);

  return {
    messages: messagesList as Message[],
    edges: edgesList as Edge[],
  };
};

export const getBranches = async (
  messageId: string
): Promise<Message[]> => {
  return (await db.query.messages.findMany({
    where: eq(messages.parentId, messageId),
    orderBy: [asc(messages.branchIndex)],
  })) as Message[];
};
