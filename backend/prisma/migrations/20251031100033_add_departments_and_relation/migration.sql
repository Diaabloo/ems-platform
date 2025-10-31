-- ========================================
-- MIGRATION SÉCURISÉE : Ajout de Department + Relation
-- Ne supprime AUCUNE donnée existante
-- ========================================

-- 1. Créer la table departments (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS "departments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. Ajouter la colonne departmentId dans CompanyEmployee
ALTER TABLE "CompanyEmployee"
ADD COLUMN IF NOT EXISTS "departmentId" UUID;

-- 3. Insérer les départements uniques à partir des noms existants
INSERT INTO "departments" (name, color)
SELECT DISTINCT
  TRIM(UPPER(department)),
  CASE
    WHEN TRIM(UPPER(department)) = 'IT' THEN '#10b981'
    WHEN TRIM(UPPER(department)) = 'HR' THEN '#3b82f6'
    WHEN TRIM(UPPER(department)) = 'FINANCE' THEN '#f59e0b'
    WHEN TRIM(UPPER(department)) = 'MARKETING' THEN '#ec4899'
    WHEN TRIM(UPPER(department)) = 'OPERATIONS' THEN '#8b5cf6'
    WHEN TRIM(UPPER(department)) = 'SALES' THEN '#ef4444'
    ELSE '#6b7280'
  END
FROM "CompanyEmployee"
WHERE department IS NOT NULL AND TRIM(department) != ''
ON CONFLICT (name) DO NOTHING;

-- 4. Créer un département par défaut "Inconnu" si besoin
INSERT INTO "departments" (name, color)
VALUES ('Inconnu', '#9ca3af')
ON CONFLICT (name) DO NOTHING;

-- 5. Lier chaque employé à son département via UUID
UPDATE "CompanyEmployee" AS e
SET "departmentId" = COALESCE(
  (SELECT d.id FROM "departments" d WHERE TRIM(UPPER(d.name)) = TRIM(UPPER(e.department))),
  (SELECT id FROM "departments" WHERE name = 'Inconnu')
)
WHERE e."departmentId" IS NULL;

-- 6. Rendre departmentId obligatoire
ALTER TABLE "CompanyEmployee"
ALTER COLUMN "departmentId" SET NOT NULL;

-- 7. Ajouter la contrainte de clé étrangère
ALTER TABLE "CompanyEmployee"
ADD CONSTRAINT "employees_departmentId_fkey"
FOREIGN KEY ("departmentId") REFERENCES "departments"(id) ON DELETE RESTRICT;

-- 8. Supprimer l'ancien champ texte "department"
ALTER TABLE "CompanyEmployee" DROP COLUMN IF EXISTS department;

-- 9. Renommer la table CompanyEmployee → employees (propre)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'CompanyEmployee') THEN
    ALTER TABLE "CompanyEmployee" RENAME TO "employees";
  END IF;
END $$;

-- 10. Créer les index nécessaires
CREATE UNIQUE INDEX IF NOT EXISTS "employees_email_key" ON "employees"("email");
CREATE INDEX IF NOT EXISTS "employees_departmentId_idx" ON "employees"("departmentId");
CREATE UNIQUE INDEX IF NOT EXISTS "departments_name_key" ON "departments"("name");

-- 11. S'assurer que la table users existe (si elle a été droppée avant)
CREATE TABLE IF NOT EXISTS "users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Fin de la migration sécurisée