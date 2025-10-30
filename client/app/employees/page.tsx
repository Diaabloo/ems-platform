// frontend/app/employees/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useStore, type Employee } from "@/lib/store"
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { EmployeeModal } from "@/components/employee-modal"
import { toast } from "sonner"

export default function EmployeesPage() {
  const router = useRouter()
  const { isAuthenticated, deleteEmployee, setEmployees } = useStore()

  // Debug store values
  console.log("useStore values:", { isAuthenticated, deleteEmployee, setEmployees })

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [apiEmployees, setApiEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const controller = new AbortController()
    // app/employees/page.tsx
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchQuery && { search: searchQuery }),
        });

        const res = await fetch(`http://localhost:5000/api/employees?${params.toString()}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // console.log("Raw API response:", JSON.stringify(json, null, 2)); // Log for debugging
        const formattedEmployees: Employee[] = json.data.employees.map((emp: any) => ({
          id: emp.id,
          fullName: emp.fullName || "Unknown", // Use fullName from API
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          role: emp.role,
          status: emp.status, // Already formatted as "Active" or "Inactive" by backend
          hireDate: emp.hireDate,
          salary: emp.salary,
          avatar: emp.avatar,
        }));
        console.log("Formatted employees:", formattedEmployees);
        setApiEmployees(formattedEmployees);
        setTotalPages(json.data.pagination.totalPages);
        setEmployees(formattedEmployees, {
          page: json.data.pagination.page,
          limit: json.data.pagination.limit,
          total: json.data.pagination.total,
          totalPages: json.data.pagination.totalPages,
        });
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Failed to load employees");
          console.error("Fetch error:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData()
    return () => controller.abort()
  }, [isAuthenticated, router, currentPage, itemsPerPage, searchQuery, setEmployees])

  if (!isAuthenticated) return null

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    const employee = apiEmployees.find((emp) => emp.id === id)
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id)
      toast.success("Employee deleted", {
        description: `${employee?.fullName} has been removed from the system.`,
      })
    }
  }

  const handleAddNew = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employees</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your organization's employees</p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Add Employee
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full max-w-md rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm text-muted-foreground">Loading employees...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm font-medium text-destructive">Error loading employees</p>
                          <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                      </td>
                    </tr>
                  ) : apiEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm font-medium text-foreground">No employees found</p>
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? "Try adjusting your search" : "Get started by adding your first employee"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    apiEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                              <span className="text-sm font-medium text-primary">{employee.fullName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{employee.fullName}</p>
                              <p className="text-sm text-muted-foreground">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{employee.department}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{employee.role}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              employee.status === "Active"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/employees/${employee.id}`}
                              onClick={() => console.log("Navigating to employee ID:", employee.id)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleEdit(employee)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEmployee(null)
        }}
        employee={editingEmployee}
      />
    </div>
  )
}