-- EMS Platform - Schéma de base
-- Les tables seront créées par Prisma migrations

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base de données sera créée automatiquement par Docker
SELECT 'EMS Platform Database initialized at ' || now();