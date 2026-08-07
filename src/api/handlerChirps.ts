import {NextFunction} from "express";
import {respondWithError, respondWithJSON} from "./json.js";
import {Request, Response} from "express";
import {createChirp, getAllChirps, getOneChirp} from "../db/queries/chirps.js";
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

export async function handlerGetChirps(req: Request, res: Response) {{
    respondWithJSON(res, 200, await getAllChirps());
}}

export async function handlerGetOneChirp(req: Request, res: Response)
 {
     const param = req.params.chirpId;
     if (typeof(param) == typeof(["string"])){
         respondWithError(res, 400, "Invalid Call")
     }
     const chirpId:string = param.toString()
     const chirp: NewChirp = await getOneChirp(chirpId);
     if (chirp == undefined) {
         respondWithError(res, 404, "Invalid ChirpId")
     }
        respondWithJSON(res, 200, chirp);
     //console.log(chirp);

 }