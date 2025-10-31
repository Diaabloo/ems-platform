import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import prisma from './src/config/db.js';
import adminRouter from './src/routes/adminRoutes.js';
import employeeRouter from './src/routes/employeeRoutes.js';
import departmentRoutes from './src/routes/departmentRoutes.js'
import logger from './src/utils/logger.js';

dotenv.config();

const app = express();

// Enable CORS for http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));


app.use(express.json());
app.use('/api/admin', adminRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/departments', departmentRoutes)

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