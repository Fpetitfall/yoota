'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
import { adminLoginAction } from './actions'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await adminLoginAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      setError('Une erreur est survenue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-50 dark:bg-blue-900/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gray-100 dark:bg-white/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
              Accès Administration
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connectez-vous pour gérer votre boutique
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all sm:text-sm"
                    placeholder="admin@yoota.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
