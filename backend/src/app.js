import express from "express";
import labRoutes from "./routes/lab.routes.js";

const app = express();
app.use(express.json());

app.use("/api/labs", labRoutes);

export default app;
