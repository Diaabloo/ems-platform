"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useStore, type Department } from "@/lib/store"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { DepartmentModal } from "@/components/department-modal"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DepartmentsPage() {
  const router = useRouter()
  const { isAuthenticated, departments, employees, deleteDepartment, fetchDepartments } = useStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login")
  //   }
  // }, [isAuthenticated, router])

  useEffect(() => {
  if (!isAuthenticated) {
    router.push("/login")
    return
  }

  const controller = new AbortController()

  const load = async () => {
    // Utilise fetchDepartments directement
    await fetchDepartments()
  }

  load()

  return () => controller.abort()
  }, [isAuthenticated, router, fetchDepartments])

  if (!isAuthenticated) return null

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }

  const handleDelete = (department: Department) => {
    setDepartmentToDelete(department)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteDepartment(departmentToDelete.id)
      toast({
        title: "Department deleted",
        description: `${departmentToDelete.name} has been removed.`,
      })
      setDeleteConfirmOpen(false)
      setDepartmentToDelete(null)
    }
  }

  const handleAddNew = () => {
    setEditingDepartment(null)
    setIsModalOpen(true)
  }

  // Calculate employee count for each department
  const departmentsWithCount = departments

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Departments</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your organization's departments</p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Add Department
            </button>
          </div>

          {/* Departments Grid */}
          {departmentsWithCount.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12">
              <Building2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No departments yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first department</p>
              <button
                onClick={handleAddNew}
                className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Add Department
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departmentsWithCount.map((department) => (
                <div
                  key={department.id}
                  className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(department)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(department)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-foreground">{department.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{department.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Employees</span>
                    <span className="text-lg font-bold text-primary">{department.employeeCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDepartment(null)
        }}
        department={editingDepartment}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{departmentToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
