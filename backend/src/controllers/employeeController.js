// import * as employeeModel from '../models/employeeModel.js';
// import { logger } from '../utils/logger.js';

// // GET employees with pagination and search
// export const getEmployees = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const search = req.query.search || '';

//     // Validate pagination parameters
//     if (page < 1 || limit < 1 || limit > 100) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid pagination parameters'
//       });
//     }

//     const result = await employeeModel.getEmployees(page, limit, search);

//     // Transform employees to match frontend format
//     const transformedEmployees = result.employees.map(emp => ({
//       id: emp.id,
//       fullName: `${emp.first_name} ${emp.last_name}`,
//       email: emp.email,
//       phone: emp.phone,
//       department: emp.department,
//       role: emp.role,
//       status: emp.status ? 'Active' : 'Inactive',
//       hireDate: emp.hireDate.toISOString().split('T')[0],
//       salary: emp.salary
//     }));

//     logger.info(`Fetched ${transformedEmployees.length} employees (page ${page})`);

//     res.json({
//       success: true,
//       data: {
//         employees: transformedEmployees,
//         pagination: {
//           page: result.page,
//           limit: result.limit,
//           total: result.total,
//           totalPages: result.totalPages
//         }
//       }
//     });
//   } catch (error) {
//     logger.error('Error fetching employees:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // GET employee by ID
// export const getEmployeeById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const employee = await employeeModel.getEmployeeById(id);

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     // Transform employee to match frontend format
//     const transformedEmployee = {
//       id: employee.id,
//       fullName: `${employee.first_name} ${employee.last_name}`,
//       email: employee.email,
//       phone: employee.phone,
//       department: employee.department,
//       role: employee.role,
//       status: employee.status ? 'Active' : 'Inactive',
//       hireDate: employee.hireDate.toISOString().split('T')[0],
//       salary: employee.salary
//     };

//     res.json({
//       success: true,
//       data: transformedEmployee
//     });
//   } catch (error) {
//     logger.error('Error fetching employee:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // CREATE new employee
// export const createEmployee = async (req, res) => {
//   try {
//     const employeeData = req.body;

//     // Validate required fields
//     const requiredFields = ['first_name', 'last_name', 'email', 'department', 'role', 'phone', 'hireDate', 'salary'];
//     const missingFields = requiredFields.filter(field => !employeeData[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }

//     // Convert hireDate to Date object
//     employeeData.hireDate = new Date(employeeData.hireDate);
//     employeeData.status = employeeData.status === 'Active' ? true : false;

//     const employee = await employeeModel.createEmployee(employeeData);

//     // Transform response
//     const transformedEmployee = {
//       id: employee.id,
//       fullName: `${employee.first_name} ${employee.last_name}`,
//       email: employee.email,
//       phone: employee.phone,
//       department: employee.department,
//       role: employee.role,
//       status: employee.status ? 'Active' : 'Inactive',
//       hireDate: employee.hireDate.toISOString().split('T')[0],
//       salary: employee.salary
//     };

//     logger.info(`Created new employee: ${transformedEmployee.fullName}`);

//     res.status(201).json({
//       success: true,
//       data: transformedEmployee
//     });
//   } catch (error) {
//     logger.error('Error creating employee:', error);

//     if (error.code === 'P2002') {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // UPDATE employee
// export const updateEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Convert hireDate to Date object if provided
//     if (updateData.hireDate) {
//       updateData.hireDate = new Date(updateData.hireDate);
//     }

//     // Convert status to boolean if provided
//     if (updateData.status) {
//       updateData.status = updateData.status === 'Active' ? true : false;
//     }

//     // Split fullName if provided
//     if (updateData.fullName) {
//       const nameParts = updateData.fullName.split(' ');
//       updateData.first_name = nameParts[0];
//       updateData.last_name = nameParts.slice(1).join(' ');
//       delete updateData.fullName;
//     }

//     const employee = await employeeModel.updateEmployee(id, updateData);

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     // Transform response
//     const transformedEmployee = {
//       id: employee.id,
//       fullName: `${employee.first_name} ${employee.last_name}`,
//       email: employee.email,
//       phone: employee.phone,
//       department: employee.department,
//       role: employee.role,
//       status: employee.status ? 'Active' : 'Inactive',
//       hireDate: employee.hireDate.toISOString().split('T')[0],
//       salary: employee.salary
//     };

//     logger.info(`Updated employee: ${transformedEmployee.fullName}`);

//     res.json({
//       success: true,
//       data: transformedEmployee
//     });
//   } catch (error) {
//     logger.error('Error updating employee:', error);

//     if (error.code === 'P2002') {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already exists'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // DELETE employee
// export const deleteEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const employee = await employeeModel.getEmployeeById(id);
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     await employeeModel.deleteEmployee(id);

//     logger.info(`Deleted employee: ${employee.first_name} ${employee.last_name}`);

//     res.json({
//       success: true,
//       message: 'Employee deleted successfully'
//     });
//   } catch (error) {
//     logger.error('Error deleting employee:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };
