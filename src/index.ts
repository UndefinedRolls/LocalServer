import express, {NextFunction} from "express";
import {Request, Response} from "express";
import {config} from "./config.js";

const app = express();
const PORT = 8080;

class badRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class unauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class forbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class notFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}



const handlerReadiness = (req: Request, res: Response) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send("OK");
}

const handlerRequests = (req: Request, res: Response) => {
    res.set('Hits', `${config.fileserverHits}`);
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`)
}

const handlerReset = (req: Request, res: Response) => {
    config.fileserverHits = 0;
    res.set('Hits', `${config.fileserverHits}`);
    res.send();
}

const middlewareLogResponses = (req: Request, res: Response, next: NextFunction)=> {
    res.on("finish", () =>{
        if (res.statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);

        }

    });
    next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    next();
}

function middlewareErrorHandling(err:Error, req: Request, res: Response, next: NextFunction) {
    console.log("Something went wrong on our end")

    if (err instanceof badRequestError) {
        res.status(400).json({error: err.message});
    }
    else if (err instanceof forbiddenError) {
        res.status(403).json({error: err.message});
    }
    else if (err instanceof unauthorizedError){
        res.status(402).json({error: err.message});
    }
    else if (err instanceof notFoundError) {
        res.status(404).json({error: err.message});
    }
    else {
        res.status(500).send(`{"error": "Something went wrong on our end"}`)
    }
        next();
}

function handlerValidation(req: Request, res: Response) {
    const INVALID_WORDS = ["KERFUFFLE", "SHARBERT", "FORNAX"];

        const request = req.body;
        if (req.body.body.length > 140)
        {
            throw new badRequestError(`Chirp is too long. Max length is 140`);
        }
        const replacement:string = "****";
        const words:string[] = request.body.split(" ");
        let clean:string[] = []
        for (let i = 0; i < words.length; i++) {
            let word = words[i].toUpperCase();

            if (INVALID_WORDS.includes(word)) {
                clean.push(replacement);
            }
            else{
                clean.push(words[i]);
            }
        }

        res.status(200).send(`{"cleanedBody": "${clean.join(' ')}"}`);
        return;

}

app.get("/api/healthz", handlerReadiness);
app.use(middlewareLogResponses);
app.use("/app", middlewareErrorHandling, middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerRequests);
app.use("/admin/metrics", express.static("./admin/metrics"));
app.post("/admin/reset", handlerReset);
app.use("/admin/reset", express.static("./api/reset"));
app.post("/api/validate_chirp", express.json(), handlerValidation, middlewareErrorHandling,);
app.use("/api/validate_chirp", express.static("./api/validate_chirp"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})