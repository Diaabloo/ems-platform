// backend/src/routes/employeeRoutes.js
import express from 'express';
import prisma from '../config/db.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/employees - Fetch employees with pagination and search
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  try {
    const skip = (page - 1) * limit;

    const employees = await prisma.companyEmployee.findMany({
      where: {
        OR: [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { first_name: 'asc' },
      skip: skip,
      take: limit,
    });

    const total = await prisma.companyEmployee.count({
      where: {
        OR: [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    const formattedEmployees = employees.map(employee => ({
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      fullName: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status ? 'Active' : 'Inactive',
      hireDate: employee.hireDate.toISOString(),
      salary: employee.salary,
      avatar: employee.avatar || undefined,
    }));

    const totalPages = Math.ceil(total / limit);

    const response = {
      success: true,
      data: {
        employees: formattedEmployees,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };

    logger.info(`Fetched ${employees.length} employees for page ${page}`);
    res.json(response);
  } catch (error) {
    logger.error(`Error fetching employees: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch employees' });
  }
});

// GET /api/employees/:id - Fetch a single employee by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await prisma.companyEmployee.findUnique({
      where: { id: id }, // Pass id as string
    });

    if (!employee) {
      logger.warn(`Employee not found: ID ${id}`);
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const formattedEmployee = {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      fullName: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status ? 'Active' : 'Inactive',
      hireDate: employee.hireDate.toISOString(),
      salary: employee.salary,
      avatar: employee.avatar || undefined,
    };

    logger.info(`Fetched employee: ${formattedEmployee.fullName}`);
    res.json({ success: true, data: formattedEmployee });
  } catch (error) {
    logger.error(`Error fetching employee ${id}: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch employee' });
  }
});

// POST /api/employees - Create a new employee
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, department, role, status, hireDate, salary } = req.body;
    const [first_name, ...lastNameParts] = fullName.split(' ');
    const last_name = lastNameParts.join(' ');

    const employee = await prisma.companyEmployee.create({
      data: {
        first_name,
        last_name: last_name || '',
        email,
        phone,
        department,
        role,
        status: status === 'Active',
        hireDate: new Date(hireDate),
        salary: salary ? parseInt(salary) : null,
      },
    });

    const formattedEmployee = {
      id: employee.id,
      fullName: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status ? 'Active' : 'Inactive',
      hireDate: employee.hireDate.toISOString(),
      salary: employee.salary,
      avatar: employee.avatar || undefined,
    };

    logger.info(`Created employee: ${formattedEmployee.fullName}`);
    res.status(201).json({ success: true, data: formattedEmployee });
  } catch (error) {
    logger.error(`Error creating employee: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id - Update an employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, department, role, status, hireDate, salary } = req.body;
    const [first_name, ...lastNameParts] = fullName.split(' ');
    const last_name = lastNameParts.join(' ');

    const employee = await prisma.companyEmployee.update({
      where: { id: id }, // Pass id as string
      data: {
        first_name,
        last_name: last_name || '',
        email,
        phone,
        department,
        role,
        status: status === 'Active',
        hireDate: new Date(hireDate),
        salary: salary ? parseInt(salary) : null,
      },
    });

    const formattedEmployee = {
      id: employee.id,
      fullName: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      status: employee.status ? 'Active' : 'Inactive',
      hireDate: employee.hireDate.toISOString(),
      salary: employee.salary,
      avatar: employee.avatar || undefined,
    };

    logger.info(`Updated employee: ${formattedEmployee.fullName}`);
    res.json({ success: true, data: formattedEmployee });
  } catch (error) {
    logger.error(`Error updating employee: ${error.message}`);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id - Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.companyEmployee.delete({
      where: { id: id }, // Pass id as string
    });

    logger.info(`Deleted employee with ID: ${id}`);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    logger.error(`Error deleting employee: ${error.message}`);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to delete employee' });
  }
});

export default router;