import Express from "express";
import morgan from "morgan";
// import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";
import bodyParser from "body-parser";
import { Cors, Limit } from "./config.js";
import Route from "./routes/Route.js";
const app = Express();
// middlewares

// app.use(morgan("combined"));
// app.use(helmet());
// app.use(rateLimit(Limit));
app.use(cors(Cors));
app.use(Express.json({ limit: "10kb" }));
// if (process.env.NODE_ENV == "development") app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xss());
app.use("/v1", Route);

app.get("/", (req, res) => {
  res.json({ message: "nice" });
});

export default app;
