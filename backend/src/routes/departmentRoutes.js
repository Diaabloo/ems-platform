// backend/routes/departmentRoutes.js
import express from 'express'
import prisma  from '../config/db.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.use(authMiddleware)

// GET /api/departments
router.get('/', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true }
        }
      }
    })

    const formatted = departments.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      color: d.color || '#9ca3af',
      employeeCount: d._count.employees  // TOTAL RÉEL
    }))

    res.json({ data: formatted })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' })
  }
})

// POST /api/departments
router.post('/', async (req, res) => {
  const { name, description, color } = req.body
  try {
    const dept = await prisma.department.create({
      data: { name, description, color }
    })
    res.json({ data: dept })
  } catch (err) {
    res.status(400).json({ error: 'Failed to create department' })
  }
})

// PUT /api/departments/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, color } = req.body
  try {
    const dept = await prisma.department.update({
      where: { id },
      data: { name, description, color }
    })
    res.json({ data: dept })
  } catch (err) {
    res.status(400).json({ error: 'Failed to update department' })
  }
})

// DELETE /api/departments/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.department.delete({ where: { id } })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete department' })
  }
})

export default router