import express, { urlencoded } from "express";
import compression from "compression";
import routes from "./routes";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const port = process.env.PORT || 3000;
const app = express();
app.set("port", port);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(routes);

export default app;
