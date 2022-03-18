import express, { urlencoded } from "express";
import compression from "compression";
import routes from "./routes";

const port = process.env.PORT || 3000;
const app = express();
app.set("port", port);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(routes);

export default app;
