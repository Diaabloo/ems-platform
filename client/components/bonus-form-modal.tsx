"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore, type Bonus } from "@/lib/store"
import { X } from "lucide-react"
import { toast } from "sonner"

interface BonusFormModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: string
  employeeName: string
  bonus?: Bonus | null
}

export function BonusFormModal({ isOpen, onClose, employeeId, employeeName, bonus }: BonusFormModalProps) {
  const { addBonus, updateBonus } = useStore()

  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    type: "Performance" as Bonus["type"],
    reason: "",
    status: "Pending" as Bonus["status"],
  })

  useEffect(() => {
    if (bonus) {
      setFormData({
        date: bonus.date,
        amount: bonus.amount,
        type: bonus.type,
        reason: bonus.reason,
        status: bonus.status,
      })
    } else {
      const now = new Date()
      setFormData({
        date: now.toISOString().split("T")[0],
        amount: 0,
        type: "Performance",
        reason: "",
        status: "Pending",
      })
    }
  }, [bonus, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (bonus) {
      updateBonus(bonus.id, formData)
      toast.success("Bonus updated successfully", {
        description: `Bonus for ${employeeName} has been updated.`,
      })
    } else {
      addBonus({
        ...formData,
        employeeId,
      })
      toast.success("Bonus added successfully", {
        description: `Bonus of $${formData.amount.toFixed(2)} has been recorded.`,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{bonus ? "Edit Bonus" : "Add Bonus"}</h2>
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
              <label className="mb-2 block text-sm font-medium text-foreground">Amount ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                required
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Bonus["type"] })}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Performance">Performance</option>
                <option value="Annual">Annual</option>
                <option value="Project">Project</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter reason for bonus..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Bonus["status"] })}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
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
              {bonus ? "Update" : "Add"} Bonus
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
