"use client"

import { useStore, type Absence } from "@/lib/store"
import { X, Calendar, CheckCircle, AlertCircle } from "lucide-react"

interface AbsenceHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: string
  employeeName: string
}

export function AbsenceHistoryModal({ isOpen, onClose, employeeId, employeeName }: AbsenceHistoryModalProps) {
  const { getAbsencesByEmployeeId } = useStore()
  const absences = getAbsencesByEmployeeId(employeeId)

  if (!isOpen) return null

  const getTypeColor = (type: Absence["type"]) => {
    switch (type) {
      case "Sick Leave":
        return "bg-orange-500/10 text-orange-500"
      case "Vacation":
        return "bg-blue-500/10 text-blue-500"
      case "Unjustified":
        return "bg-red-500/10 text-red-500"
    }
  }

  const getStatusIcon = (status: Absence["status"]) => {
    return status === "Approved" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-yellow-500" />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Absence History</h2>
            <p className="mt-1 text-sm text-muted-foreground">{employeeName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-6">
          {absences.length === 0 ? (
            <div className="py-12 text-center">
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reason</th>
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
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTypeColor(absence.type)}`}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-border p-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-secondary px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
