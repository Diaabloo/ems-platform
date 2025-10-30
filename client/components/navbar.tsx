"use client"

import { Bell, Search } from "lucide-react"
import { useStore } from "@/lib/store"

export function Navbar() {
  const user = useStore((state) => state.user)

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{user?.fullName?.charAt(0) || "A"}</span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-foreground">{user?.fullName || "Admin User"}</div>
            <div className="text-muted-foreground">{user?.email || "admin@company.com"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
