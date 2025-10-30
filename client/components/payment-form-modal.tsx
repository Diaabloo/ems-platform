"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore, type Payment } from "@/lib/store"
import { X } from "lucide-react"
import { toast } from "sonner"

interface PaymentFormModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: string
  employeeName: string
  payment?: Payment | null
}

export function PaymentFormModal({ isOpen, onClose, employeeId, employeeName, payment }: PaymentFormModalProps) {
  const { addPayment, updatePayment } = useStore()

  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    period: "",
    status: "Pending" as Payment["status"],
    method: "Bank Transfer" as Payment["method"],
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        date: payment.date,
        amount: payment.amount,
        period: payment.period,
        status: payment.status,
        method: payment.method,
      })
    } else {
      // Set default values for new payment
      const now = new Date()
      const currentMonth = now.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      setFormData({
        date: now.toISOString().split("T")[0],
        amount: 0,
        period: currentMonth,
        status: "Pending",
        method: "Bank Transfer",
      })
    }
  }, [payment, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (payment) {
      updatePayment(payment.id, formData)
      toast.success("Payment updated successfully", {
        description: `Payment for ${employeeName} has been updated.`,
      })
    } else {
      addPayment({
        ...formData,
        employeeId,
      })
      toast.success("Payment added successfully", {
        description: `Payment of $${formData.amount.toFixed(2)} has been recorded.`,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{payment ? "Edit Payment" : "Add Payment"}</h2>
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
              <label className="mb-2 block text-sm font-medium text-foreground">Payment Date</label>
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
              <label className="mb-2 block text-sm font-medium text-foreground">Period</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g., October 2025"
                required
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Payment Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as Payment["method"] })}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Payment["status"] })}
                className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
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
              {payment ? "Update" : "Add"} Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
