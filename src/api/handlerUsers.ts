import {Request, Response} from "express";
import {respondWithJSON} from "./json.js";
import {createUser} from "../db/queries/users.js";

export async function handlerUsers(req: Request, res: Response) {
    type parameters = {
        body: string;
    }

    const user_email = req.body.email;
    const user = await createUser({
        email: user_email,
    });

    respondWithJSON(res, 201, user);

}