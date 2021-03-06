import express, { urlencoded } from "express";
import compression from "compression";
import routes from "./routes";
import dotenv from "dotenv";
import notFound from "./errors/notFound";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config({ path: ".env.dev" });
const corsOptions: cors.CorsOptions = {
    origin: "*",
    methods: "GET ,HEAD, POST ,DELETE ,PATCH ,PUT",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user: {
                _id: string;
                name: {
                    first: string;
                    last: string;
                };
                email: string;
                role: {
                    _id: string;
                    name: string;
                };
                gender: string;
            };
        }
    }
}

const port = process.env.PORT || 3000;
const app = express();
app.set("port", port);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors(corsOptions));
app.options("*", cors);

app.use(routes);
app.use(notFound);
app.use(errorHandlerMiddleware);

export default app;
