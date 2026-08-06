import {NextFunction} from "express";
import {respondWithJSON} from "./json.js";
import {Request, Response} from "express";
import {createChirp} from "../db/queries/chirps.js";
import {NewChirp} from "../db/schema.js";

export async function handlerChirps(req: Request, res: Response) {
    const chirpRaw = req.body;
    const body = chirpRaw.body;
    const userId = chirpRaw.userId;
    const chirp:NewChirp = {
        "body": body,
        "userId": userId,
    }


    const savedChirp = await createChirp(chirp);
    console.log(savedChirp);
    respondWithJSON(res, 201, savedChirp);
}