import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, User, Lock, Eye, EyeOff, ArrowRight, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'PATIENT',
    speciality: '',
  })

  const specialities = [
    { value: 'GENERAL_MEDICINE', label: 'Medecine Generale' },
    { value: 'CARDIOLOGY', label: 'Cardiologie' },
    { value: 'DERMATOLOGY', label: 'Dermatologie' },
    { value: 'PEDIATRICS', label: 'Pediatrie' },
    { value: 'GYNECOLOGY', label: 'Gynecologie' },
    { value: 'OPHTHALMOLOGY', label: 'Ophtalmologie' },
    { value: 'ORTHOPEDICS', label: 'Orthopedie' },
    { value: 'NEUROLOGY', label: 'Neurologie' },
    { value: 'PSYCHIATRY', label: 'Psychiatrie' },
    { value: 'UROLOGY', label: 'Urologie' },
    { value: 'ENT', label: 'ORL' },
    { value: 'DENTISTRY', label: 'Dentisterie' },
    { value: 'RADIOLOGY', label: 'Radiologie' },
    { value: 'ONCOLOGY', label: 'Oncologie' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Valider le formulaire
      if (formData.username.length < 3) {
        toast.error('Le nom d\'utilisateur doit avoir au moins 3 caractères')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        toast.error('Le mot de passe doit avoir au moins 6 caractères')
        setLoading(false)
        return
      }

      // Preparer les donnees (enlever speciality si pas DOCTOR)
      const dataToSend = { ...formData }
      if (dataToSend.role !== 'DOCTOR') {
        delete dataToSend.speciality
      }

      const user = await registerUser(dataToSend)

      toast.success('Inscription réussie!')
      toast.success(`Bienvenue ${user.username}!`)

      // Rediriger vers dashboard (utilisateur est automatiquement connecté)
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription'
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-light rounded-3xl p-8 shadow-glass-lg">
          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Rejoignez PDS Health</h1>
            <p className="text-white/60">Créez votre compte pour commencer</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">
                Type de compte
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="glass-input w-full"
                required
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Médecin</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </motion.div>

            {/* Speciality (only for DOCTOR) */}
            {formData.role === 'DOCTOR' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.37 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Specialite
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <select
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="glass-input pl-12 w-full"
                    required
                  >
                    <option value="">Selectionnez une specialite</option>
                    {specialities.map((spec) => (
                      <option key={spec.value} value={spec.value}>
                        {spec.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="john123"
                  className="glass-input pl-12"
                  minLength={3}
                  required
                />
              </div>
              <p className="text-xs text-white/50 mt-1">Minimum 3 caractères</p>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="glass-input pl-12 pr-12"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-white/50 mt-1">Minimum 6 caractères</p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <>
                  S'inscrire
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <p className="text-white/60 text-sm">
              Déjà inscrit?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Se connecter
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/40 text-xs mt-6"
        >
          © 2024 PDS Health. Tous droits réservés.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Register
