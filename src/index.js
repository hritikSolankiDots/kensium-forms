import express from "express";
import "dotenv/config";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.js";
import webhookRouter from "./routes/webhook.js";
import portalRouter from "./routes/portal.js";
const app = express();
const PORT = process.env.PORT || 3000;

// set up EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/public', express.static('public'));

// webhook route
app.use("/", portalRouter);

app.use("/webhook", webhookRouter);

// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
