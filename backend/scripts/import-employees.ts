// scripts/import-employees.ts - VERSION FINALE (PRÊTE À L'EMPLOI)
import { PrismaClient } from '../src/generated/prisma';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

async function main() {
const csvPath = path.join('C:\\Users\\XPS\\Downloads\\company_employees.csv');
const backupDir = path.join(__dirname, '../backups');

  // Créer dossier backup
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  if (!fs.existsSync(csvPath)) {
    console.error('Fichier CSV non trouvé : ' + csvPath);
    return;
  }

  const employees: any[] = [];
  const deptNames = new Set<string>();

  console.log('Lecture du CSV en cours...');

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (row) => {
        const deptName = row.department?.trim().toUpperCase() || 'INCONNU';
        deptNames.add(deptName);

        employees.push({
          first_name: row.first_name?.trim() || 'Inconnu',
          last_name: row.last_name?.trim() || 'Inconnu',
          email: row.email?.trim().toLowerCase() || `employee${Date.now()}@example.com`,
          phone: row.phone?.trim() || null,
          department: deptName,
          role: row.role?.trim() || 'Employé',
          salary: parseInt(row.salary) || 50000,
          hireDate: row.hireDate ? new Date(row.hireDate) : new Date(),
          status: row.status === 'true' || row.status === true,
        });
      })
      .on('end', () => {
        console.log(`${employees.length} employés lus du CSV`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Erreur lecture CSV:', err);
        reject(err);
      });
  });

  // COULEURS PAR DÉPARTEMENT
  const colors: Record<string, string> = {
    'ENGINEERING': '#10b981',
    'HUMAN RESOURCES': '#3b82f6',
    'FINANCE': '#f59e0b',
    'MARKETING': '#ec4899',
    // 'OPERATIONS': '#8b5cf6',
    // 'SALES': '#ef4444',
    'INCONNU': '#9ca3af',
  };

  // Créer/mettre à jour les départements
  for (const name of deptNames) {
    await prisma.department.upsert({
      where: { name },
      update: { color: colors[name] || '#6b7280' },
      create: {
        name,
        color: colors[name] || '#6b7280',
        description: name === 'INCONNU' ? 'Département par défaut' : undefined,
      },
    });
  }

  console.log(`${deptNames.size} départements créés/validés avec couleurs`);

  // Récupérer les IDs
  const depts = await prisma.department.findMany({
    where: { name: { in: Array.from(deptNames) } },
  });
  const deptMap = Object.fromEntries(depts.map(d => [d.name, d.id]));

  // Préparer les employés
  const empData = employees.map(e => ({
    first_name: e.first_name,
    last_name: e.last_name,
    full_name: `${e.first_name} ${e.last_name}`,
    email: e.email,
    phone: e.phone,
    departmentId: deptMap[e.department] || deptMap['INCONNU'],
    role: e.role,
    salary: e.salary,
    hireDate: e.hireDate,
    status: e.status,
  }));

  // Insérer
  await prisma.companyEmployee.createMany({
    data: empData,
    skipDuplicates: true,
  });

  console.log(`${empData.length} employés insérés en base !`);

  // BACKUP AUTOMATIQUE
  const date = new Date().toISOString().split('T')[0];
  const backupCsvEmp = path.join(backupDir, `employees_${date}.csv`);
  const backupCsvDept = path.join(backupDir, `departments_${date}.csv`);

  const allEmps = await prisma.companyEmployee.findMany({
    select: { first_name: true, last_name: true, email: true, role: true, salary: true, departmentId: true },
  });
  const allDepts = await prisma.department.findMany({ select: { name: true, color: true } });

  fs.writeFileSync(
    backupCsvEmp,
    'first_name,last_name,email,role,salary,departmentId\n' +
      allEmps.map(e => `${e.first_name},${e.last_name},${e.email},${e.role},${e.salary},${e.departmentId}`).join('\n')
  );

  fs.writeFileSync(
    backupCsvDept,
    'name,color\n' +
      allDepts.map(d => `${d.name},${d.color}`).join('\n')
  );

  console.log(`Backups créés :`);
  console.log(`   - Employés : ${backupCsvEmp}`);
  console.log(`   - Départements : ${backupCsvDept}`);

  console.log('IMPORT TERMINÉ AVEC SUCCÈS !');
  console.log('Vérifie avec : npx prisma studio');
}

main()
  .catch((e) => {
    console.error('ERREUR FATALE:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });