import { db } from "../index.js";
import { NewUser, CleanUser, users } from "../schema.js";
import {eq} from "drizzle-orm";

export async function createUser(user: NewUser):Promise<CleanUser> {
    console.log(user);
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    console.log(result);
    return {
        "id": result.id,
        "createdAt": result.createdAt,
        "updatedAt": result.updatedAt,
        "email": user.email,
    }
}

export async function clearUsers(){
    await db
        .delete(users)
}

export async function getUserByEmail(email:string):Promise<NewUser>{
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
    return result
}