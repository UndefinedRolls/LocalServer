import express, {NextFunction} from "express";
import {Request, Response} from "express";
import {config} from "./config.js";

const app = express();
const PORT = 8080;


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

app.get("/api/healthz", handlerReadiness);
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerRequests);
app.use("/admin/metrics", express.static("./admin/metrics"));
app.post("/admin/reset", handlerReset);
app.use("/admin/reset", express.static("./api/reset"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})