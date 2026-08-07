import {Request, Response} from "express";
import {respondWithError, respondWithJSON} from "./json.js";
import {createUser, getUserByEmail} from "../db/queries/users.js";
import {checkPasswordHash, hashPassword} from "../auth.js";

export async function handlerUsers(req: Request, res: Response) {
    type parameters = {
        body: string;
        password: string;
    }

    const user_email = req.body.email;
    const raw_password = req.body.password;
    const user = await createUser({
        email: user_email,
        hashedPassword: await hashPassword(raw_password)
    });

    respondWithJSON(res, 201, user);

}

export async function handlerUserLogin(req: Request, res: Response) {
    const user_email = req.body.email;
    const raw_password = req.body.password;
    const user = await getUserByEmail(user_email)
    const password = user.hashedPassword;
    if (password=="undefined") {
        respondWithError(res, 401, "incorrect user or password");
    }
    // @ts-ignore
    const hashedPassword:string = password;
    if (await checkPasswordHash(raw_password, hashedPassword)) {
    respondWithJSON(res, 200, {
        "id": user.id,
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt,
        "email": user.email});
    }
    respondWithError(res, 401, "incorrect user or password");
}