import fs from "fs";
import path from "path";
import express, { Express, Request, Response } from "express";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import walletsRouter from "./routes/wallets";

const prisma = new PrismaClient();

/*import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);*/

//const credentials = JSON.parse(
//    fs.readFileSync('./credentials.json')
//);

const app: Express = express();
app.use(express.json());
app.use(express.static("../build"));

console.log(process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

app.use("/api/wallets", walletsRouter);

/*app.get(/^(?!\/api).+/, (req: Request, res: Response) => {
  res.sendFile("../build/index.html");
});*/

// process.env.PORT ||
const PORT = 8000;

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
