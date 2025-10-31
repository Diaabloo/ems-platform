// frontend/app/employees/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useStore, type Absence, type Payment, type Bonus, type Leave, type Employee } from "@/lib/store"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  Activity,
  CheckCircle,
  AlertCircle,
  Plus,
  DollarSign,
  Gift,
  Edit,
  Trash2,
  Plane,
} from "lucide-react"
import { AbsenceFormModal } from "@/components/absence-form-modal"
import { PaymentFormModal } from "@/components/payment-form-modal"
import { BonusFormModal } from "@/components/bonus-form-modal"
import { LeaveFormModal } from "@/components/leave-form-modal"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function EmployeeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const {
    isAuthenticated,
    getAbsencesByEmployeeId,
    getPaymentsByEmployeeId,
    getBonusesByEmployeeId,
    getLeavesByEmployeeId,
    deleteAbsence,
    deletePayment,
    deleteBonus,
    deleteLeave,
    getEmployeeById,
  } = useStore()

  // Debug store values
  console.log("useStore values:", {
    isAuthenticated,
    getAbsencesByEmployeeId,
    getPaymentsByEmployeeId,
    getBonusesByEmployeeId,
    getLeavesByEmployeeId,
    getEmployeeById,
  })

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"absences" | "payments" | "bonuses" | "leaves">("absences")
  const [isAbsenceFormOpen, setIsAbsenceFormOpen] = useState(false)
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false)
  const [isBonusFormOpen, setIsBonusFormOpen] = useState(false)
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false)
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null)
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<"absence" | "payment" | "bonus" | "leave">("absence")
  const [itemToDelete, setItemToDelete] = useState<Absence | Payment | Bonus | Leave | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // const employeeId = Number(params.id) // Convert to number
    const employeeId = params.id as string
    const fetchEmployee = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const formattedEmployee: Employee = {
          id: json.data.id,
          fullName: `${json.data.first_name} ${json.data.last_name}`, // Fixed: Use first_name and last_name
          email: json.data.email,
          phone: json.data.phone,
          department: json.data.department?.name || 'Aucun',     // .name
          departmentColor: json.data.department?.color || '#9ca3af', // .color
          role: json.data.role,
          status: json.data.status ? "Active" : "Inactive",
          hireDate: new Date(json.data.hireDate).toISOString(),
          salary: json.data.salary,
        }
        console.log("Fetched employee:", formattedEmployee)
        setEmployee(formattedEmployee)
      } catch (e: any) {
        setError(e.message || "Failed to load employee")
        console.error("Fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [isAuthenticated, router, params.id])

  const absences = employee ? getAbsencesByEmployeeId(employee.id) : []
  const payments = employee ? getPaymentsByEmployeeId(employee.id) : []
  const bonuses = employee ? getBonusesByEmployeeId(employee.id) : []
  const leaves = employee ? getLeavesByEmployeeId(employee.id) : []

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex flex-1 items-center justify-center p-6">
            <p className="text-muted-foreground">Loading employee details...</p>
          </main>
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex flex-1 items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Employee not found</h2>
              <p className="mt-2 text-muted-foreground">{error || "The employee you're looking for doesn't exist."}</p>
              <Link
                href="/employees"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Employees
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: Absence["type"]) => {
    switch (type) {
      case "Sick Leave":
        return "bg-orange-500/10 text-orange-500"
      case "Vacation":
        return "bg-blue-500/10 text-blue-500"
      case "Unjustified":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getLeaveTypeColor = (type: Leave["type"]) => {
    switch (type) {
      case "Vacation":
        return "bg-blue-500/10 text-blue-500"
      case "Sick Leave":
        return "bg-orange-500/10 text-orange-500"
      case "Maternity/Paternity":
        return "bg-purple-500/10 text-purple-500"
      case "Unpaid Leave":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getStatusIcon = (status: Absence["status"] | Payment["status"] | Bonus["status"] | Leave["status"]) => {
    if (status === "Approved" || status === "Paid") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const handleEditAbsence = (absence: Absence) => {
    setEditingAbsence(absence)
    setIsAbsenceFormOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setIsPaymentFormOpen(true)
  }

  const handleEditBonus = (bonus: Bonus) => {
    setEditingBonus(bonus)
    setIsBonusFormOpen(true)
  }

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave)
    setIsLeaveFormOpen(true)
  }

  const handleDeleteAbsence = (absence: Absence) => {
    setItemToDelete(absence)
    setDeleteType("absence")
    setDeleteConfirmOpen(true)
  }

  const handleDeletePayment = (payment: Payment) => {
    setItemToDelete(payment)
    setDeleteType("payment")
    setDeleteConfirmOpen(true)
  }

  const handleDeleteBonus = (bonus: Bonus) => {
    setItemToDelete(bonus)
    setDeleteType("bonus")
    setDeleteConfirmOpen(true)
  }

  const handleDeleteLeave = (leave: Leave) => {
    setItemToDelete(leave)
    setDeleteType("leave")
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    switch (deleteType) {
      case "absence":
        deleteAbsence(itemToDelete.id)
        toast({
          title: "Absence deleted",
          description: "The absence record has been removed.",
        })
        break
      case "payment":
        deletePayment(itemToDelete.id)
        toast({
          title: "Payment deleted",
          description: "The payment record has been removed.",
        })
        break
      case "bonus":
        deleteBonus(itemToDelete.id)
        toast({
          title: "Bonus deleted",
          description: "The bonus record has been removed.",
        })
        break
      case "leave":
        deleteLeave(itemToDelete.id)
        toast({
          title: "Leave deleted",
          description: "The leave record has been removed.",
        })
        break
    }

    setDeleteConfirmOpen(false)
    setItemToDelete(null)
  }

  const calculateLeaveDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <Link
              href="/employees"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-3xl font-bold text-primary">{employee.fullName.charAt(0)}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-foreground">{employee.fullName}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{employee.role}</p>
                  <span
                    className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      employee.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {employee.status}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{employee.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      Hired on{" "}
                      {new Date(employee.hireDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {employee.salary && (
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">${employee.salary.toLocaleString()}/year</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Joined the company</p>
                      <p className="text-sm text-muted-foreground">
                        Started on{" "}
                        {new Date(employee.hireDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Assigned to {employee.department}</p>
                      <p className="text-sm text-muted-foreground">Department assignment</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Status: {employee.status}</p>
                      <p className="text-sm text-muted-foreground">Current employment status</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Additional Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                    <p className="mt-1 text-foreground">#{employee.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="mt-1 text-foreground">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p className="mt-1 text-foreground">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employment Status</p>
                    <p className="mt-1 text-foreground">{employee.status}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex gap-2 border-b border-border">
                  <button
                    onClick={() => setActiveTab("absences")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "absences"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Absences
                  </button>
                  <button
                    onClick={() => setActiveTab("payments")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "payments"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    Payments
                  </button>
                  <button
                    onClick={() => setActiveTab("bonuses")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "bonuses"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Gift className="h-4 w-4" />
                    Bonuses
                  </button>
                  <button
                    onClick={() => setActiveTab("leaves")}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "leaves"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Plane className="h-4 w-4" />
                    Leaves
                  </button>
                </div>

                {activeTab === "absences" && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">Absence History</h3>
                      <button
                        onClick={() => {
                          setEditingAbsence(null)
                          setIsAbsenceFormOpen(true)
                        }}
                        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                        Add Absence
                      </button>
                    </div>

                    {absences.length === 0 ? (
                      <div className="py-8 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium text-foreground">No absences recorded</p>
                        <p className="mt-1 text-sm text-muted-foreground">This employee has no absence history</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Duration
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reason</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {absences.map((absence) => (
                              <tr key={absence.id} className="border-b border-border last:border-0">
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {new Date(absence.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTypeColor(
                                      absence.type,
                                    )}`}
                                  >
                                    {absence.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {absence.duration} {absence.duration === 1 ? "day" : "days"}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(absence.status)}
                                    <span className="text-sm text-foreground">{absence.status}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{absence.reason || "-"}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditAbsence(absence)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAbsence(absence)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "payments" && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">Payment History</h3>
                      <button
                        onClick={() => {
                          setEditingPayment(null)
                          setIsPaymentFormOpen(true)
                        }}
                        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                        Add Payment
                      </button>
                    </div>

                    {payments.length === 0 ? (
                      <div className="py-8 text-center">
                        <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium text-foreground">No payments recorded</p>
                        <p className="mt-1 text-sm text-muted-foreground">This employee has no payment history</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Period</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment) => (
                              <tr key={payment.id} className="border-b border-border last:border-0">
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {new Date(payment.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">{payment.period}</td>
                                <td className="px-4 py-3 text-sm font-medium text-foreground">
                                  ${payment.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{payment.method}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(payment.status)}
                                    <span className="text-sm text-foreground">{payment.status}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditPayment(payment)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePayment(payment)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "bonuses" && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">Bonus History</h3>
                      <button
                        onClick={() => {
                          setEditingBonus(null)
                          setIsBonusFormOpen(true)
                        }}
                        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                        Add Bonus
                      </button>
                    </div>

                    {bonuses.length === 0 ? (
                      <div className="py-8 text-center">
                        <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium text-foreground">No bonuses recorded</p>
                        <p className="mt-1 text-sm text-muted-foreground">This employee has no bonus history</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reason</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bonuses.map((bonus) => (
                              <tr key={bonus.id} className="border-b border-border last:border-0">
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {new Date(bonus.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                    {bonus.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-foreground">
                                  ${bonus.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{bonus.reason}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(bonus.status)}
                                    <span className="text-sm text-foreground">{bonus.status}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditBonus(bonus)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteBonus(bonus)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "leaves" && (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">Leave History</h3>
                      <button
                        onClick={() => {
                          setEditingLeave(null)
                          setIsLeaveFormOpen(true)
                        }}
                        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                        Add Leave
                      </button>
                    </div>

                    {leaves.length === 0 ? (
                      <div className="py-8 text-center">
                        <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium text-foreground">No leaves recorded</p>
                        <p className="mt-1 text-sm text-muted-foreground">This employee has no leave history</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Start Date
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                End Date
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Duration
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reason</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaves.map((leave) => (
                              <tr key={leave.id} className="border-b border-border last:border-0">
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {new Date(leave.startDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {new Date(leave.endDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getLeaveTypeColor(
                                      leave.type,
                                    )}`}
                                  >
                                    {leave.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                  {calculateLeaveDuration(leave.startDate, leave.endDate)}{" "}
                                  {calculateLeaveDuration(leave.startDate, leave.endDate) === 1 ? "day" : "days"}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(leave.status)}
                                    <span className="text-sm text-foreground">{leave.status}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{leave.reason || "-"}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditLeave(leave)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLeave(leave)}
                                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <AbsenceFormModal
            isOpen={isAbsenceFormOpen}
            onClose={() => {
              setIsAbsenceFormOpen(false)
              setEditingAbsence(null)
            }}
            employeeId={employee.id}
            absence={editingAbsence}
          />
          <PaymentFormModal
            isOpen={isPaymentFormOpen}
            onClose={() => {
              setIsPaymentFormOpen(false)
              setEditingPayment(null)
            }}
            employeeId={employee.id}
            payment={editingPayment}
          />
          <BonusFormModal
            isOpen={isBonusFormOpen}
            onClose={() => {
              setIsBonusFormOpen(false)
              setEditingBonus(null)
            }}
            employeeId={employee.id}
            bonus={editingBonus}
          />
          <LeaveFormModal
            isOpen={isLeaveFormOpen}
            onClose={() => {
              setIsLeaveFormOpen(false)
              setEditingLeave(null)
            }}
            employeeId={employee.id}
            leave={editingLeave}
          />

          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the {deleteType} record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  )
}