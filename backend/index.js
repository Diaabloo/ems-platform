import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./src/config/db.js";
import adminRouter from "./src/routes/adminRoutes.js";
import employeeRouter from "./src/routes/employeeRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";
import healthRouter from "./src/routes/healthRoutes.js";
import logger from "./src/utils/logger.js";

dotenv.config();

const app = express();

// // Enable CORS for http://localhost:3000
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow frontend origin
//     // origin: [
//     //   "http://localhost:3000",
//     //   "http://ems.localhost",
//     // ],
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   }),
// );
const allowedOrigins = [
  "http://localhost:3000",
  "https://nonentomologic-spring-conflictedly.ngrok-free.dev",
  "http://ems.localhost:8080",
  "https://fast-vertically-terrapin.ngrok-free.app",
  "http://frontend.ems-platform.svc.cluster.local:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origin (ex: curl, postman)
      if (!origin) {
        // console.warn(
        //   "Requête sans en-tête Origin détectée. Autorisation par défaut pour le développement.",
        // );
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `L'origine ${origin} n'est pas autorisée par la politique CORS.`;
        logger.error(msg);
        return callback(new Error(msg), false);
      }

      // RENVOYER L'ORIGINE DANS LA REPONSE CORS (très important)
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  res.on("finish", () => {
    console.log(
      "Access-Control-Allow-Origin:",
      res.getHeader("Access-Control-Allow-Origin"),
    );
  });
  next();
});

app.use("/api/admin", adminRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/departments", departmentRoutes);
app.use("/api", healthRouter);

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    logger.info("✅ Connexion à PostgreSQL réussie !");
  } catch (err) {
    logger.error("❌ Erreur de connexion :" + err.message);
    process.exit(1);
  }
}

main();

app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
