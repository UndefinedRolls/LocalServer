import {config} from "../config.js";
import {Request, Response} from "express";
import {respondWithError} from "./json.js";
import {clearUsers} from "../db/queries/users.js";


export async function handlerReset(req: Request, res: Response) {
    if (config.platform != "dev"){
        respondWithError(res, 403, "Forbidden");
    }

    await clearUsers()
    config.api.fileserverHits = 0;
    res.write(`Hits ${config.api.fileserverHits}`);
    res.end();
}
