import {Request, Response, NextFunction} from "express";
import {config} from "../config.js";
import {badRequestError, forbiddenError, unauthorizedError, notFoundError} from "./errors.js";
import {respondWithError} from "./json.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.api.fileserverHits++;
    next();
}

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () =>{
        if (res.statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);

        }

    });
    next();
}


export function middlewareErrorHandling(err:Error, req: Request, res: Response, next: NextFunction) {
    let message = "Something went wrong on our end";
    let statusCode = 500;
    if (err instanceof badRequestError) {
        statusCode = 400;
    }
    else if (err instanceof forbiddenError) {
        statusCode = 403;
    }
    else if (err instanceof unauthorizedError){
        statusCode = 402;
    }
    else if (err instanceof notFoundError) {
        statusCode = 404;
    }
    if (statusCode !== 500){
        message = err.message;
    }
    if (statusCode <= 500){
        console.log(err.message);
    }
    respondWithError(res, statusCode, message);
}

