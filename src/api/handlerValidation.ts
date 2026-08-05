import {Request, Response} from "express";
import {respondWithJSON} from "./json.js";
import {badRequestError} from "./errors.js";

export async function handlerValidation(req: Request, res: Response) {
    type parameters = {
        body:string;
    }
    const request = req.body;
    const maxLength = 140;
    const chirp: parameters = req.body;

    const INVALID_WORDS = ["KERFUFFLE", "SHARBERT", "FORNAX"];

    if (chirp.body.length > maxLength) {
        throw new badRequestError(`Chirp is too long. Max length is 140`);
    }
    const replacement: string = "****";
    const words: string[] = request.body.split(" ");
    let clean: string[] = []
    for (let i = 0; i < words.length; i++) {
        let word = words[i].toUpperCase();

        if (INVALID_WORDS.includes(word)) {
            clean.push(replacement);
        } else {
            clean.push(words[i]);
        }
    }
    const cleaned = clean.join(' ');
    respondWithJSON(res, 200, {cleanedBody: cleaned});
}