"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore, type Department } from "@/lib/store"
import { X } from "lucide-react"
import { toast } from "sonner"

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  department: Department | null
}

export function DepartmentModal({ isOpen, onClose, department }: DepartmentModalProps) {
  const { addDepartment, updateDepartment } = useStore()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [department, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (department) {
      updateDepartment(department.id, formData)
      toast.success("Department updated successfully", {
        description: `${formData.name} has been updated.`,
      })
    } else {
      addDepartment(formData)
      toast.success("Department added successfully", {
        description: `${formData.name} has been added to the system.`,
      })
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {department ? "Edit Department" : "Add New Department"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Department Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Engineering"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Brief description of the department..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-input bg-background px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {department ? "Update Department" : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
