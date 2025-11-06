"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Spinner } from "@/components/ui/Spinner"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/tasks")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <div className="text-center space-y-8 mb-20">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight">Gestor de tareas</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Organiza tu trabajo de manera eficiente. Crea, edita y gestiona tus tareas con una interfaz limpia y
              directa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Comenzar ahora
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
