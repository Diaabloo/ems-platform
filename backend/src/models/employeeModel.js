// import prisma from '../config/db.js';

// // GET all employees with pagination and search
// export async function getEmployees(page = 1, limit = 10, search = '') {
//   const skip = (page - 1) * limit;

//   // Build search conditions
//   const searchConditions = search ? {
//     OR: [
//       { first_name: { contains: search, mode: 'insensitive' } },
//       { last_name: { contains: search, mode: 'insensitive' } },
//       { email: { contains: search, mode: 'insensitive' } },
//       { department: { contains: search, mode: 'insensitive' } },
//       { role: { contains: search, mode: 'insensitive' } }
//     ]
//   } : {};

//   // Get employees with pagination
//   const employees = await prisma.companyEmployee.findMany({
//     where: searchConditions,
//     skip,
//     take: limit,
//     orderBy: { first_name: 'asc' }
//   });

//   // Get total count for pagination
//   const total = await prisma.companyEmployee.count({
//     where: searchConditions
//   });

//   return {
//     employees,
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit)
//   };
// }

// // GET employee by ID
// export async function getEmployeeById(id) {
//   return prisma.companyEmployee.findUnique({
//     where: { id }
//   });
// }

// // CREATE new employee
// export async function createEmployee(employeeData) {
//   return prisma.companyEmployee.create({
//     data: employeeData
//   });
// }

// // UPDATE employee
// export async function updateEmployee(id, employeeData) {
//   return prisma.companyEmployee.update({
//     where: { id },
//     data: employeeData
//   });
// }

// // DELETE employee
// export async function deleteEmployee(id) {
//   return prisma.companyEmployee.delete({
//     where: { id }
//   });
// }

// // GET total count of employees
// export async function getEmployeeCount() {
//   return prisma.companyEmployee.count();
// }

