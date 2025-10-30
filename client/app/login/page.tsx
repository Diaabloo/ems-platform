"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Mail, Lock, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Sending login request:", { email, password });
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);
      if (!response.ok) {
        setError(data.error || "Erreur lors de la connexion");
        return;
      }
      setUserId(data.userId);
      setShowVerification(true);
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };

const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Sending verify request:", { userId, code: verificationCode });
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Veuillez entrer un code de vérification à 6 chiffres");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: verificationCode }),
      });
      console.log("Verify response status:", response.status);
      const data = await response.json();
      console.log("Verify response data:", data);
      if (!response.ok) {
        setError(data.error || "Code invalide ou expiré");
        return;
      }
      // Store JWT token (always store it for the session)
      localStorage.setItem("token", data.token);
      // Update Zustand store
      console.log("Calling login with:", { email, token: data.token, userId: userId?.toString() }); // Debug
      const success = login(email, data.token, userId!.toString());
      console.log("Login function returned:", success); // Debug
      if (success) {
        console.log("Navigating to /dashboard"); // Debug
        router.push("/dashboard");
      } else {
        setError("Erreur lors de la mise à jour de l'état de connexion");
      }
    } catch (err) {
      console.error("Verify error:", err);
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">AGE</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground text-balance">Connexion Admin</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {showVerification
                ? "Entrez le code de vérification envoyé à votre email"
                : "Connectez-vous pour accéder au panneau d'administration"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          {!showVerification ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Email Admin
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                  Se souvenir de moi
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continuer
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* Verification Code */}
              <div>
                <label htmlFor="code" className="mb-2 block text-sm font-medium text-foreground">
                  Code de vérification
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-center text-2xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-2 text-xs text-muted-foreground">Entrez le code à 6 chiffres envoyé à {email}</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Vérifier & Connexion
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationCode("");
                  setError("");
                }}
                className="h-11 w-full rounded-lg border border-input bg-background font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Retour
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}