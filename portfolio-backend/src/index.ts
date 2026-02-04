import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRoutes from "./routes/portfolio";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend server is running",
    time: new Date().toISOString(),
  });
});

app.use("/portfolio", portfolioRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
   