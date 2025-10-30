"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore, type Absence } from "@/lib/store"
import { X } from "lucide-react"
import { toast } from "sonner"

interface AbsenceFormModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: string
  employeeName: string
  absence?: Absence | null
}

export function AbsenceFormModal({ isOpen, onClose, employeeId, employeeName, absence }: AbsenceFormModalProps) {
  const { addAbsence, updateAbsence } = useStore()

  const [formData, setFormData] = useState({
    date: "",
    type: "Sick Leave" as Absence["type"],
    duration: 1,
    status: "Pending" as Absence["status"],
    reason: "",
  })

  useEffect(() => {
    if (absence) {
      setFormData({
        date: absence.date,
        type: absence.type,
        duration: absence.duration,
        status: absence.status,
        reason: absence.reason || "",
      })
    } else {
      setFormData({
        date: "",
        type: "Sick Leave",
        duration: 1,
        status: "Pending",
        reason: "",
      })
    }
  }, [absence, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (absence) {
      updateAbsence(absence.id, formData)
      toast.success("Absence updated successfully", {
        description: `${employeeName}'s absence has been updated.`,
      })
    } else {
      addAbsence({
        ...formData,
        employeeId,
      })
      toast.success("Absence added successfully", {
        description: `Absence for ${employeeName} has been recorded.`,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{absence ? "Edit Absence" : "Add Absence"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{employeeName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Absence["type"] })}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation">Vacation</option>
                <option value="Unjustified">Unjustified</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Duration (days)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                required
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Absence["status"] })}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Reason (optional)</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter reason for absence..."
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-secondary px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {absence ? "Update" : "Add"} Absence
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
