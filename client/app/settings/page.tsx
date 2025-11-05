git push origin dev"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useStore } from "@/lib/store"
import { Moon, Sun, Building2, Save } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, theme, toggleTheme } = useStore()

  const [companyInfo, setCompanyInfo] = useState({
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 (555) 000-0000",
    address: "123 Business St, Suite 100, San Francisco, CA 94105",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const handleSave = () => {
    // In a real app, this would save to a backend
    alert("Settings saved successfully!")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your application preferences</p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Appearance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {theme === "dark" ? (
                    <>
                      <Moon className="h-5 w-5" />
                      Dark
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      Light
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Company Information */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Company Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Company Name</label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
                    <input
                      type="tel"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Address</label>
                  <textarea
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
