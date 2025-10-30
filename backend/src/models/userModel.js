import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

// GET User by email
export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

// Verify password
export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

// Create User (admin)
export async function createUser(email, password, role = 'admin') {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, password: hashed, role },
  });
}

// Find all users
export async function findAdmins() {
  return prisma.user.findMany({ where: { role: 'admin' } });
}

// Update User
export async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

// Delete User
export async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}