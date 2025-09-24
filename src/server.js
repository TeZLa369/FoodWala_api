import express from "express"
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favTables } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";


const app = express()
const PORT = ENV.PORT || 5001

if (ENV.NODE_ENV === "production") { job.start() };

app.use(express.json()); //^used this line so that the line 16th will work, otherwise it will be undefined

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true });
});


app.post("/api/favorites", async (req, res) => {
    try {
        const { user_Id, recipe_Id, title, image, cookTime, servings } = req.body;

        if (!user_Id || !recipe_Id || !title) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newFav = await db.insert(favTables).values({
            user_Id, recipe_Id, title, image, cookTime, servings,
        }).returning();

        res.status(201).json(newFav[0]);

    } catch (error) {
        console.log("Error while adding favTable: ", error);
        res.status(500).json({ error: "Something went wrong" });
    }
})

app.get("/api/favorites/:user_Id", async (req, res) => {
    try {
        const { user_Id } = req.params;

        const userFav = await db.select().from(favTables).where(eq(favTables.user_Id, user_Id)); //^ eq=> Equals to. (a,b)=> 'a' equals to 'b'
        res.json(userFav);

    } catch (error) {
        console.log("Error fetching a favorite: ", error);
        res.status(500).json({ error: "Something went wrong" });
    }
})


app.delete("/api/favorites/:user_Id/:recipe_Id", async (req, res) => {
    try {
        const { user_Id, recipe_Id } = req.params;

        await db.delete(favTables).where(
            and(eq(favTables.user_Id, user_Id), eq(favTables.recipe_Id, parseInt(recipe_Id)))
        );
        res.status(200).json({ message: "Favorite removed successfully" });

    } catch (error) {
        console.log("Error while removing a favTable: ", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});



app.listen(PORT, () => {
    console.log("Server is running on: ", PORT);
})