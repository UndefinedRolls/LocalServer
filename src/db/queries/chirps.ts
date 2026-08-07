import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import {asc, eq} from "drizzle-orm";

export async function createChirp(body: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(body)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getAllChirps(){
    return db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
}

export async function getOneChirp(chirpId: string){
    const [result] =  await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId))
    return result;
}