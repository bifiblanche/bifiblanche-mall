import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  nameKo: text("name_ko").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  descriptionKo: text("description_ko").notNull(),
  keyIngredient: text("key_ingredient").notNull(),
  image: text("image").notNull(),
  volume: text("volume").notNull(),
  storeUrl: text("store_url"),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // "event" | "archive"
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
