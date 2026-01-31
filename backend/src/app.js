import express from "express";
import cors from "cors";
import labRoutes from "./routes/lab.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/labs", labRoutes);

export default app;
