import {hash, verify} from "argon2"

export async function hashPassword(password: string) {
    return await hash(password);
}

export async function checkPasswordHash(password: string, hash:string){
    const result = await verify(hash, password);
    return result;
}