"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Absence {
  id: string
  employeeId: number
  date: string
  type: "Sick Leave" | "Vacation" | "Unjustified"
  duration: number // in days
  status: "Approved" | "Pending"
  reason?: string
}

export interface Leave {
  id: string
  employeeId: number
  startDate: string
  endDate: string
  type: "Vacation" | "Sick Leave" | "Maternity/Paternity" | "Unpaid Leave" | "Other"
  status: "Approved" | "Pending" | "Rejected"
  reason?: string
}

export interface Payment {
  id: string
  employeeId: number
  date: string
  amount: number
  period: string // e.g., "January 2025"
  status: "Paid" | "Pending" | "Processing"
  method: "Bank Transfer" | "Check" | "Cash"
}

export interface Bonus {
  id: string
  employeeId: number
  date: string
  amount: number
  type: "Performance" | "Annual" | "Project" | "Holiday"
  reason: string
  status: "Paid" | "Pending"
}

export interface Employee {
  id: number
  first_name?: string
  last_name?: string
  email: string
  phone: string
  department: string
  role: string
  status: "Active" | "Inactive"
  hireDate: string
  salary?: number
}

export interface Department {
  id: string
  name: string
  description: string
  employeeCount: number
}

export interface User {
  id: string
  fullName: string
  email: string
  token: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, token: string, id: string) => boolean
  signup: () => boolean
  logout: () => void

  // Theme
  theme: "light" | "dark"
  toggleTheme: () => void

  // Employees
  employees: Employee[]
  employeesPagination: { page: number; limit: number; total: number; totalPages: number }
  setEmployees: (employees: Employee[], pagination: { page: number; limit: number; total: number; totalPages: number }) => void
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: number, employee: Partial<Employee>) => void
  deleteEmployee: (id: number) => void
  getEmployeeById: (id: number) => Employee | undefined

  // Departments
  departments: Department[]
  addDepartment: (department: Omit<Department, "id" | "employeeCount">) => void
  updateDepartment: (id: string, department: Partial<Department>) => void
  deleteDepartment: (id: string) => void

  absences: Absence[]
  addAbsence: (absence: Omit<Absence, "id">) => void
  updateAbsence: (id: string, absence: Partial<Absence>) => void
  deleteAbsence: (id: string) => void
  getAbsencesByEmployeeId: (employeeId: number) => Absence[]
  getMonthlyAbsencesCount: (employeeId: number) => number

  payments: Payment[]
  addPayment: (payment: Omit<Payment, "id">) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  deletePayment: (id: string) => void
  getPaymentsByEmployeeId: (employeeId: number) => Payment[]

  bonuses: Bonus[]
  addBonus: (bonus: Omit<Bonus, "id">) => void
  updateBonus: (id: string, bonus: Partial<Bonus>) => void
  deleteBonus: (id: string) => void
  getBonusesByEmployeeId: (employeeId: number) => Bonus[]

  leaves: Leave[]
  addLeave: (leave: Omit<Leave, "id">) => void
  updateLeave: (id: string, leave: Partial<Leave>) => void
  deleteLeave: (id: string) => void
  getLeavesByEmployeeId: (employeeId: number) => Leave[]
  hasActiveLeave: (employeeId: number) => boolean
}

// Mock initial data
const initialEmployees: Employee[] = [];

const initialDepartments: Department[] = [
  { id: "1", name: "Engineering", description: "Software development and technical operations", employeeCount: 2 },
  { id: "2", name: "Marketing", description: "Brand management and customer outreach", employeeCount: 1 },
  { id: "3", name: "Human Resources", description: "Employee relations and talent management", employeeCount: 1 },
  { id: "4", name: "Finance", description: "Financial planning and analysis", employeeCount: 1 },
]

const initialAbsences: Absence[] = [
  {
    id: "1",
    employeeId: 1,
    date: "2025-10-05",
    type: "Sick Leave",
    duration: 2,
    status: "Approved",
    reason: "Flu",
  },
  {
    id: "2",
    employeeId: 1,
    date: "2025-10-12",
    type: "Vacation",
    duration: 1,
    status: "Approved",
    reason: "Personal day",
  },
  {
    id: "3",
    employeeId: 2,
    date: "2025-10-08",
    type: "Vacation",
    duration: 5,
    status: "Approved",
    reason: "Family vacation",
  },
  {
    id: "4",
    employeeId: 3,
    date: "2025-10-10",
    type: "Sick Leave",
    duration: 1,
    status: "Pending",
    reason: "Medical appointment",
  },
  {
    id: "5",
    employeeId: 5,
    date: "2025-10-03",
    type: "Unjustified",
    duration: 1,
    status: "Approved",
  },
]

const initialPayments: Payment[] = [
  {
    id: "1",
    employeeId: 1,
    date: "2025-10-01",
    amount: 7916.67,
    period: "October 2025",
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "2",
    employeeId: 1,
    date: "2025-09-01",
    amount: 7916.67,
    period: "September 2025",
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "3",
    employeeId: 2,
    date: "2025-10-01",
    amount: 6500,
    period: "October 2025",
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "4",
    employeeId: 3,
    date: "2025-10-01",
    amount: 5166.67,
    period: "October 2025",
    status: "Processing",
    method: "Bank Transfer",
  },
  {
    id: "5",
    employeeId: 5,
    date: "2025-10-01",
    amount: 6833.33,
    period: "October 2025",
    status: "Paid",
    method: "Bank Transfer",
  },
]

const initialBonuses: Bonus[] = [
  {
    id: "1",
    employeeId: 1,
    date: "2025-09-15",
    amount: 5000,
    type: "Performance",
    reason: "Exceptional Q3 performance and project delivery",
    status: "Paid",
  },
  {
    id: "2",
    employeeId: 2,
    date: "2025-08-01",
    amount: 3000,
    type: "Project",
    reason: "Successful marketing campaign launch",
    status: "Paid",
  },
  {
    id: "3",
    employeeId: 5,
    date: "2025-10-10",
    amount: 2500,
    type: "Performance",
    reason: "Outstanding code quality and mentorship",
    status: "Pending",
  },
]

const initialLeaves: Leave[] = [
  {
    id: "1",
    employeeId: 2,
    startDate: "2025-10-15",
    endDate: "2025-10-20",
    type: "Vacation",
    status: "Approved",
    reason: "Family vacation",
  },
  {
    id: "2",
    employeeId: 4,
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    type: "Sick Leave",
    status: "Approved",
    reason: "Medical recovery",
  },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,

      login: (email: string, token: string, id: string) => {
        console.log("Login called with:", { email, token, id })
        try {
          if (!email || !token || !id) {
            console.error("Invalid login arguments:", { email, token, id })
            return false
          }
          set({
            user: { id, fullName: "Admin User", email, token },
            isAuthenticated: true,
          })
          console.log("Login successful, state updated")
          return true
        } catch (err) {
          console.error("Login error:", err)
          return false
        }
      },

      signup: () => {
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        localStorage.removeItem("token")
      },

      // Theme
      theme: "dark",
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark"
        set({ theme: newTheme })
        document.documentElement.classList.toggle("light", newTheme === "light")
      },

      // Employees
      employees: initialEmployees,
      employeesPagination: { page: 1, limit: 10, total: initialEmployees.length, totalPages: 1 },
      setEmployees: (employees, pagination) => {
        set({ employees, employeesPagination: pagination })
      },
      addEmployee: (employee) => {
        const newEmployee = {
          ...employee,
          id: Date.now(),
        }
        set((state) => ({
          employees: [...state.employees, newEmployee],
          employeesPagination: {
            ...state.employeesPagination,
            total: state.employees.length + 1,
            totalPages: Math.ceil((state.employees.length + 1) / state.employeesPagination.limit),
          },
        }))
      },
      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)),
        }))
      },
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
          employeesPagination: {
            ...state.employeesPagination,
            total: state.employees.length - 1,
            totalPages: Math.ceil((state.employees.length - 1) / state.employeesPagination.limit),
          },
        }))
      },
      getEmployeeById: (id) => {
        return get().employees.find((emp) => emp.id === id)
      },

      // Departments
      departments: initialDepartments,
      addDepartment: (department) => {
        const newDepartment = {
          ...department,
          id: Date.now().toString(),
          employeeCount: 0,
        }
        set((state) => ({
          departments: [...state.departments, newDepartment],
        }))
      },
      updateDepartment: (id, updates) => {
        set((state) => ({
          departments: state.departments.map((dept) => (dept.id === id ? { ...dept, ...updates } : dept)),
        }))
      },
      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((dept) => dept.id !== id),
        }))
      },

      absences: initialAbsences,
      addAbsence: (absence) => {
        const newAbsence = {
          ...absence,
          id: Date.now().toString(),
        }
        set((state) => ({
          absences: [...state.absences, newAbsence],
        }))
      },
      updateAbsence: (id, updates) => {
        set((state) => ({
          absences: state.absences.map((abs) => (abs.id === id ? { ...abs, ...updates } : abs)),
        }))
      },
      deleteAbsence: (id) => {
        set((state) => ({
          absences: state.absences.filter((abs) => abs.id !== id),
        }))
      },
      getAbsencesByEmployeeId: (employeeId) => {
        return get().absences.filter((abs) => abs.employeeId === employeeId)
      },
      getMonthlyAbsencesCount: (employeeId) => {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        return get()
          .absences.filter((abs) => {
            const absDate = new Date(abs.date)
            return (
              abs.employeeId === employeeId &&
              absDate.getMonth() === currentMonth &&
              absDate.getFullYear() === currentYear
            )
          })
          .reduce((total, abs) => total + abs.duration, 0)
      },

      payments: initialPayments,
      addPayment: (payment) => {
        const newPayment = {
          ...payment,
          id: Date.now().toString(),
        }
        set((state) => ({
          payments: [...state.payments, newPayment],
        }))
      },
      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map((pay) => (pay.id === id ? { ...pay, ...updates } : pay)),
        }))
      },
      deletePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter((pay) => pay.id !== id),
        }))
      },
      getPaymentsByEmployeeId: (employeeId) => {
        return get().payments.filter((pay) => pay.employeeId === employeeId)
      },

      bonuses: initialBonuses,
      addBonus: (bonus) => {
        const newBonus = {
          ...bonus,
          id: Date.now().toString(),
        }
        set((state) => ({
          bonuses: [...state.bonuses, newBonus],
        }))
      },
      updateBonus: (id, updates) => {
        set((state) => ({
          bonuses: state.bonuses.map((bon) => (bon.id === id ? { ...bon, ...updates } : bon)),
        }))
      },
      deleteBonus: (id) => {
        set((state) => ({
          bonuses: state.bonuses.filter((bon) => bon.id !== id),
        }))
      },
      getBonusesByEmployeeId: (employeeId) => {
        return get().bonuses.filter((bon) => bon.employeeId === employeeId)
      },

      leaves: initialLeaves,
      addLeave: (leave) => {
        const newLeave = {
          ...leave,
          id: Date.now().toString(),
        }
        set((state) => ({
          leaves: [...state.leaves, newLeave],
        }))
        const today = new Date()
        const startDate = new Date(leave.startDate)
        const endDate = new Date(leave.endDate)
        if (leave.status === "Approved" && today >= startDate && today <= endDate) {
          get().updateEmployee(leave.employeeId, { status: "Inactive" })
        }
      },
      updateLeave: (id, updates) => {
        set((state) => ({
          leaves: state.leaves.map((leave) => (leave.id === id ? { ...leave, ...updates } : leave)),
        }))
        const leave = get().leaves.find((l) => l.id === id)
        if (leave) {
          const updatedLeave = { ...leave, ...updates }
          const today = new Date()
          const startDate = new Date(updatedLeave.startDate)
          const endDate = new Date(updatedLeave.endDate)
          if (updatedLeave.status === "Approved" && today >= startDate && today <= endDate) {
            get().updateEmployee(leave.employeeId, { status: "Inactive" })
          } else if (!get().hasActiveLeave(leave.employeeId)) {
            get().updateEmployee(leave.employeeId, { status: "Active" })
          }
        }
      },
      deleteLeave: (id) => {
        const leave = get().leaves.find((l) => l.id === id)
        set((state) => ({
          leaves: state.leaves.filter((leave) => leave.id !== id),
        }))
        if (leave && !get().hasActiveLeave(leave.employeeId)) {
          get().updateEmployee(leave.employeeId, { status: "Active" })
        }
      },
      getLeavesByEmployeeId: (employeeId) => {
        return get().leaves.filter((leave) => leave.employeeId === employeeId)
      },
      hasActiveLeave: (employeeId) => {
        const today = new Date()
        return get().leaves.some((leave) => {
          const startDate = new Date(leave.startDate)
          const endDate = new Date(leave.endDate)
          return (
            leave.employeeId === employeeId &&
            leave.status === "Approved" &&
            today >= startDate &&
            today <= endDate
          )
        })
      },
    }),
    {
      name: "employee-management-storage",
    },
  ),
)