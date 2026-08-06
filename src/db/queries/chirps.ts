import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(body: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(body)
        .onConflictDoNothing()
        .returning();
    return result;
}
