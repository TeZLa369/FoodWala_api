//^ ORM=> this will be used to communicating with the database, like creating, deleting, etc.
//^ Kit will be used to apply changes from the local files to the actual DB

import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const favTables = pgTable("favorites", {
    id: serial("id").primaryKey(),
    user_Id: text("user_Id").notNull(),
    recipe_Id: integer("recipe_Id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookTime: text("cook_time"),
    servings: text("servings"),
    createdAt: timestamp("created_at").defaultNow(),
});